import React from "react";
import { nodeTypes } from "../lib/node-types";

// Component to test if all icons are properly imported
const IconTest = () => {
  const testIcons = () => {
    const results = [];

    Object.entries(nodeTypes).forEach(([key, node]) => {
      const Icon = node.icon;
      const isValid = Icon && typeof Icon === "function";

      results.push({
        key,
        label: node.label,
        isValid,
        icon: Icon,
      });

      if (!isValid) {
        console.error(`Invalid icon for ${key}:`, Icon);
      }
    });

    return results;
  };

  const iconResults = testIcons();
  const invalidIcons = iconResults.filter((r) => !r.isValid);

  if (invalidIcons.length > 0) {
    console.warn("Invalid icons found:", invalidIcons);
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-semibold text-yellow-800 mb-2">Icon Test Results</h3>
      <div className="text-sm">
        <p className="text-green-600">
          Valid icons: {iconResults.filter((r) => r.isValid).length}
        </p>
        <p className="text-red-600">Invalid icons: {invalidIcons.length}</p>
        {invalidIcons.length > 0 && (
          <div className="mt-2">
            <p className="font-medium text-red-700">Failed icons:</p>
            <ul className="list-disc list-inside text-red-600">
              {invalidIcons.map((icon) => (
                <li key={icon.key}>
                  {icon.label} ({icon.key})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default IconTest;
