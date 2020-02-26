const express = require("express");

const server = express();

server.use(express.json());

const projects = [
  {
    id: "1",
    title: "Start Bootcamp",
    tasks: []
  },
  {
    id: "2",
    title: "Josh Archer",
    tasks: []
  },
  {
    id: "3",
    title: "SIOC",
    tasks: []
  },
  {
    id: "4",
    title: "Concurso Veterinaria",
    tasks: []
  }
];

let idProject = undefined;
let totalReq = 0;

// Project Template: id-string, title-string, tasks-array

function logRequisicoes(req, res, next) {
  totalReq++;
  console.log(
    `Método: ${req.method}, Url: ${req.url}, Total de Requisições: ${totalReq}`
  );
  //console.count("Requisições");
  next();
}

server.use(logRequisicoes);

function idProjectExists(req, res, next) {
  const { id } = req.params;
  idProject = undefined;

  //tambem pode "buscar" o index assim:
  //const project = projects.find(p => p.id == id);

  //busca mais "verbosa"
  projects.forEach((element, index) => {
    //console.log(element, index);
    if (element.id == id) {
      console.log("Entrou Middleware: ", id, element.id, index);
      idProject = index;
    }
  });

  if (idProject == undefined) {
    return res.status(400).json({ message: "Project not found!" });
  }

  next();
}

// Create Project
server.post("/projects", (req, res) => {
  const project = req.body;
  projects.push(project);
  return res.json({ message: "Projeto - " + project.title });
});

// Get All Projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Alter Project Title
server.put("/projects/:id", idProjectExists, (req, res) => {
  const project = req.body;
  projects[idProject].title = project.title;
  return res.json({ message: "Alterado com Sucesso" });
});

// Delete Project
server.delete("/projects/:id", idProjectExists, (req, res) => {
  projects.splice(idProject, 1);
  return res.json({
    message: "Project removido com sucesso!",
    idProject,
    projects
  });
});

// Create Tasks for a Project
server.post("/projects/:id/tasks", idProjectExists, (req, res) => {
  const task = req.body;
  projects[idProject].tasks.push(task.title);
  return res.json({ message: "Tarefa cadastrada com sucesso!" });
});

server.listen(3000);
