class API_features {
  constructor(query, query_string) {
    this.query = query;
    this.query_string = query_string;
  }
  filter() {
    // const collection = server.get_db();
    // filtering

    const query_obj = { ...this.query_string };
    const excluded_fields = ['sort', 'fields', 'page', 'limit'];
    excluded_fields.forEach((el) => delete query_obj[el]);

    let query_str = JSON.stringify(query_obj);
    query_str = query_str.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const filtered_query = JSON.parse(query_str);

    this.query = this.query.find(filtered_query);

    return this;
  }

  sort() {
    let sort_params;
    // Sorting
    if (this.query_string.sort) {
      sort_params = get_sort_params(this.query_string.sort);
    } else {
      sort_params = { price: -1 };
    }

    this.query = this.query.sort(sort_params);

    return this;
  }

  limit_fields() {
    let projection_params;
    // Limit fields
    if (this.query_string.fields) {
      projection_params = get_projection(this.query_string.fields);
    } else {
      projection_params = '';
    }

    this.query = this.query.project(projection_params);

    return this;
  }

  paginate() {
    // Pagination
    const page = this.query_string.page * 1 || 1; // Default page is 1
    const limit = this.query_string.limit * 1 || 100; // Default limit is 100
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit).toArray();

    return this;
  }
}

const get_sort_params = (params) => {
  const sort_res = [];
  let direction = [];
  let sort = params.split(',');
  sort.forEach((result, i) => {
    if (sort[i].charAt(0) === '-') {
      direction[i] = -1;
      sort[i] = sort[i].replace('-', '');
    } else {
      direction[i] = 1;
    }
    sort_res[i] = { res: [sort[i]], val: direction[i] };
  });

  // Array to object
  // https://stackoverflow.com/questions/42974735/create-object-from-array
  const sort_obj = sort_res.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.res]: curr.val,
    }),
    {}
  );

  return sort_obj;
};

const get_projection = (params) => {
  let show = [];
  const projection = params.split(',');
  projection.forEach((res, i) => {
    if (projection[i].charAt(0) === '-') {
      show[i] = -1;
      projection[i] = projection[i].replace('-', '');
    } else {
      show[i] = 1;
    }
    projection[i] = { res: [res], val: show[i] };
  });

  // Array to object
  // https://stackoverflow.com/questions/42974735/create-object-from-array
  const projection_obj = projection.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.res]: curr.val,
    }),
    {}
  );

  return projection_obj;
};

module.exports = API_features;
