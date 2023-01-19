/* eslint-disable object-shorthand */
/**
 * Metronom default data types.
 * @module Types
 * @constant
 */
export const Types = {
  String: String,
  Boolean: Boolean,
  Date: Date,
  Number: Number,
  Array: Array,
  Object: Object,
  // TypedArray: (valueType: any) => {
  //   if (!this[valueType]) {
  //     throw new Error(`Invalid array type: "${valueType}"!`);
  //   }
  //   return {
  //     type: valueType,
  //   };
  // },
} as const;
