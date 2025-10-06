import { debounce } from "lodash";

export const debounceOnChange = debounce((callback) => {
  callback();
}, 500);
