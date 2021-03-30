using { cuid } from '@sap/cds/common';
namespace tecnologia;

entity Tecnologias : cuid {
    nombre : String(100);
    costo : Integer64;
    dificultad : Association to many Tecnologias_Dificultades on dificultad.tecnologia = $self;
}

entity Dificultades : cuid {
    dificultad : Integer enum {
        Baja = 1;
        Media = 2;
        Alta = 3;
    };
    horas : Integer;
    tecnologia : Association to many Tecnologias_Dificultades on tecnologia.dificultad = $self;
}

entity Tecnologias_Dificultades : cuid {
    tecnologia : Association to Tecnologias;
    dificultad : Association to Dificultades;
    proyecto_tecnologia : Association to many Proyecto_Tecnologia on proyecto_tecnologia.tecnologia_dificultad = $self;
}

entity Proyecto_Tecnologia : cuid {
    proyecto : Association to Proyectos;
    tecnologia_dificultad : Association to Tecnologias_Dificultades;
}

entity Proyectos : cuid {
    nombre : String(100);
    cliente : Association to Clientes;
    proyecto_hijo : Composition of many Proyecto_Tecnologia on proyecto_hijo.proyecto = $self;
}

entity Clientes : cuid {
    nombre : String(50);
    proyecto : Association to Proyectos on proyecto.cliente = $self;
}