const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const validDDDs = [11, 12, 13, 14, 15, 16, 17, 18, 19, 31, 32, 33, 34, 35, 37, 38, 21, 22, 24, 27, 28, 41, 42, 43, 44, 45, 46, 51, 53, 54, 55, 47, 48, 49, 68, 96, 92, 97, 91, 93, 94, 69, 95, 63, 61, 62, 64, 65, 66, 67, 82, 71, 73, 74, 75, 77, 85, 88, 98, 99, 83, 81, 87, 86, 89, 84, 79 ]; 
const isValidDDD = (ddd) => validDDDs.includes(parseInt(ddd));

const isValidDate = (date) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!date.match(regex)) return false;
    const [day, month, year] = date.split('/').map(Number);
    const jsDate = new Date(year, month - 1, day);
    return jsDate && jsDate.getDate() === day && jsDate.getMonth() + 1 === month && jsDate.getFullYear() === year;
};

app.get('/', (req, res) => {
    res.render('form', { 
        success: false, 
        errors: [], 
        nomeAluno: '', 
        nascimento: '', 
        email: '', 
        ddd: '', 
        telefone: '', 
        serie: '', 
        turno: '', 
        atividades: [] 
    });
});

app.post('/submit', (req, res) => {
    let { nomeAluno, nascimento, email, ddd, telefone, serie, turno, atividades } = req.body; // Mudando para let
    let errors = [];

    if (!nomeAluno || !nascimento || !email || !ddd || !telefone || !serie || !turno) {
        errors.push('Todos os campos são obrigatórios, exceto as atividades extracurriculares.');
    }

    if (!isValidDate(nascimento)) {
        errors.push('A data de nascimento deve ser válida.');
    }

    if (!email.includes('@') || !email.includes('.')) {
        errors.push('O e-mail deve conter "@" e ".".');
    }

    if (!isValidDDD(ddd)) {
        errors.push('O DDD informado não é válido.');
    }

    if (atividades && !Array.isArray(atividades)) {
        atividades = [atividades]; 
    }

    if (atividades.length > 3) {
        errors.push('Você pode selecionar no máximo 3 atividades extracurriculares.');
    }

    if (errors.length > 0) {
        res.render('form', {
            success: false,
            errors,
            nomeAluno,
            nascimento,
            email,
            ddd,
            telefone,
            serie,
            turno,
            atividades
        });
    } else {
        res.render('form', { success: true, nomeAluno });
    }
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
