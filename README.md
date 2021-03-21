### Analytics doc-gen
---
Parse all files in a directory and document anayltics events in a Google Sheet.

Annotate events using comments in below format. Include tags below, 
@Analytics is required, any other valid tags (in format "@Tag") are optional.
```java
/// @Analytics_event [event name]
/// @Category [category]
/// @Description [description]
``` 

To setup 

(run below and then add config files in /config)
```
npm install
```

To upload doc to Google sheet
```
npm run doc-gen
```
To export doc as csv
```
npm run doc-gen-csv
```