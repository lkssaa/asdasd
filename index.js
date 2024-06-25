import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static('site'));

const connection = mysql.createConnection({
    host: "localhost",
    user: "pril",
    password: "1234",
    database: "project"
});

app.get('/getcontents', function(req, res) {
    connection.query(`
        SELECT * FROM project.contents WHERE languageID = '${req.query.language}' AND partitID = ${req.query.id};
        `,(err, results, fields) => {
            res.send(results);
        });
    
})

app.get('/gettopics', function(req, res) {
    connection.query(`
        SELECT * FROM project.partit WHERE languageId = '${req.query.language}';
        `,(err, results, fields) => {
            res.send(results);
        });
    
})
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'site', 'index.html'), function(err) {
      if (err) {
        console.error('Не удалось отправить файл:', err);
        res.status(500).send('Ошибка при отправке файла');
      }
    });
  });
app.get('/edit', function(req, res){
    connection.query(`
        UPDATE project.contents SET text_content = '${req.query.text}' WHERE languageID = '${req.query.language}' AND partitID = ${req.query.id};
        `,(err, results, fields) => {
            console.log(results);
        });
})
app.get('/add', function(req, res) {
    connection.query(`
        INSERT partit(partit_id, partit_name, languageId) VALUES ((SELECT MAX(partit_id) FROM partit)+1, '${req.query.name}', '${req.query.language}');
        `,(err, results, fields) => {
            console.log(results);
        });
    connection.query(`
        INSERT contents(partitID, subjectID, languageID, text_content, pictures) VALUES ((SELECT MAX(partit_id) FROM partit),1, '${req.query.language}', ' ', NULL);
        `,(err, results, fields) => {
            console.log(results);
        });
})
app.listen(9898, (err) => {
  if (err){
      return console.log(err)
  }
  console.log('server ok')
});
