import EN_JSON from "../language/en.json";
export default function getComponentTexts(component) {
  return EN_JSON[`${component}`];
}
