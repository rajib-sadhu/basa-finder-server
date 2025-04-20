/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, FilterQuery } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm as string | undefined;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      } as FilterQuery<T>);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query } as Record<string, any>;
    const excludingImportant = [
      "searchTerm",
      "page",
      "limit",
      "sortOrder",
      "sortBy",
      "fields",
    ];
    excludingImportant.forEach((key) => delete queryObj[key]);

    const filterQuery: Record<string, any> = {};

    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === "object" && queryObj[key] !== null) {
        filterQuery[key] = {};
        Object.keys(queryObj[key] as Record<string, string>).forEach(
          (operator) => {
            if (["gte", "lte", "gt", "lt"].includes(operator)) {
              filterQuery[key][`$${operator}`] = Number(
                (queryObj[key] as Record<string, string>)[operator]
              );
            }
          }
        );
      } else if (!isNaN(Number(queryObj[key]))) {
        filterQuery[key] = Number(queryObj[key]);
      } else {
        filterQuery[key] = queryObj[key];
      }
    });

    this.modelQuery = this.modelQuery.find(filterQuery as FilterQuery<T>);
    return this;
  }

  sort() {
    let sortStr = "-createdAt";

    if (this.query.sortBy && typeof this.query.sortBy === "string") {
      const sortOrder = this.query.sortOrder === "asc" ? "" : "-";
      sortStr = `${sortOrder}${this.query.sortBy}`;
    }

    this.modelQuery = this.modelQuery.sort(sortStr);
    return this;
  }

  select() {
    let fields = "-__v";
    if (this.query.fields && typeof this.query.fields === "string") {
      fields = this.query.fields.split(",").join(" ");
    }
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
}

export default QueryBuilder;
