import saved from "./visitor-info.json";
import { emptyVisitorInfo, parseVisitorValues, type VisitorInfo } from "@/lib/visitor-info";

export const publishedVisitorInfo: VisitorInfo = { ...emptyVisitorInfo(), ...parseVisitorValues(saved, true) };
