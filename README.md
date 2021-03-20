### Analytics doc-gen
---
Parse all files in a directory and document anayltics events in a Google Sheet.

Annotate events using comments in below format. Include tags below, 
@Analytics is required, others are optional.
```java
/// @Analytics_event [event name]
/// @Category [category]
/// @Description [description]
``` 

To set up
```
npm install
```
To start
```
npm run doc-gen
```
To export a csv
```
npm run doc-gen-csv
```