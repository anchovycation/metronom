/* eslint-disable object-shorthand */
export const Types = {
  String: String,
  Boolean: Boolean,
  Date: Date,
  Number: Number,
  BigInt: BigInt,
  Array: (valueType: any) => Array<typeof valueType>, 
};
