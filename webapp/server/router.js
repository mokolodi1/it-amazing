import fs from "fs";
import path from "path";
import { spawn } from "child_process";
// import mime

Picker.route("/images/:image_id", function(params, req, res, next) {
  let image = Images.findOne(params.image_id);

  // res.setHeader("Content-Type", blob.mime_type);
  res.writeHead(200);

  fs.createReadStream(image.path).pipe(res);

  return;
});
