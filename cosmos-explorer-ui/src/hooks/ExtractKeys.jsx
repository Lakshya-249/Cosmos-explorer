import { useState } from "react";
import { GetSuggestionsArray } from "../utils/helper.service";

export const useExtractKeys = () => {
  const [keys, setKeys] = useState({
    collection: [],
  });

  const extractKeys = (data, collection) => {
    const suggestedKeys = GetSuggestionsArray(data, collection);
    let completeSuggestions;
    if (keys[collection]) {
      completeSuggestions = new Set([...keys[collection], ...suggestedKeys]);
    } else {
      completeSuggestions = new Set(suggestedKeys);
    }

    const finalSuggestions = Array.from(completeSuggestions);

    setKeys({ ...keys, [collection]: finalSuggestions });

    return finalSuggestions;
  };

  return { extractKeys };
};
