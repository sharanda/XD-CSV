# Adobe XD CSV importer
This plugin parses a selected CSV file, and applies contents to your text layers.

Structure of your CSV file should look like this:
|Name of a layer|Contents|
|---|---|
|intro-title|Lorem ipsum|
|intro-paragraph|Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.|
|about-me|Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.|
|any layer name|Duis aute irure dolor in reprehenderit.|

## Current limitations
- Plugin looks for text only inside artboards;
- Plugin doesn't search for text inside the groups;

## Bonuses
1. Text{%10%} will turn to superscript like Text<sup>10</sup>
```
2. HTML tags <br/> and <br> will turn to normal line-breaks.
```

That's all for now. If someone else uses that, I might consider adding more functionality.
