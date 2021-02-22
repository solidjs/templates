import { DataFn } from "solid-app-router";
import { mergeProps } from "solid-js";

const HomeData: DataFn = (props) => {
  return mergeProps(props, {
    name: "about",
  });
};

export default HomeData;
