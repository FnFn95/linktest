/**
 *@author       谢辉
 *@date         2018/10/14 13:45
 *@Copyright    天源迪科信息技术股份有限公司
 *@Description  事项template.json生成脚本,通过*.json融合*-business.json的方式.
 */
const fs = require('fs');
const jsonfile = require('jsonfile')
const path = require('path');
const rm=require('rimraf').sync;
const filePath = path.resolve(__dirname,'../../view/data/procceeds');
const fileRegxp = /\d.json$/;
console.log(filePath)

function generate() {
  fs.readdir(filePath, (error, files) => {
    if (error) {
      console.log(error)
    } else {
      files.forEach(item => {
        if (item.match(fileRegxp)) {
          jsonfile.readFile(filePath + '/' + item).then((file) => {
            jsonfile.readFile(filePath + '/' + path.parse(item).name + '-business.json').then(business => {
              console.dir(filePath + '/' + path.parse(item).name + '-template.json');
              rm(filePath + '/' + path.parse(item).name + '-template.json');
              file.data.page.fullModel={...file.data.page.fullModel,...business.data};
              jsonfile.writeFile(filePath + '/' + path.parse(item).name + '-template.json',file.data,()=>{})
            }).catch(e => {
              // console.log(e)
            });
          }).catch(e => {
            // console.log(e)
          });
        }
      })
    }
  })
}

generate();

