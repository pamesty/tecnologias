using { tecnologia as my } from '../db/schema';

service MyApp {

    entity Clientes as projection on my.Clientes;

    entity Proyectos as select from my.Proyectos {
        *,
        cliente.nombre as nombre_cliente
    };

    entity Tecnologias as projection on my.Tecnologias;

    entity Dificultades as projection on my.Dificultades;
    
    entity Proyecto_Tecnologia as select from my.Proyecto_Tecnologia {
        *,
        proyecto.nombre as nombre_proyecto,
        tecnologia_dificultad.tecnologia.nombre as nombre_tecnologia,
        tecnologia_dificultad.tecnologia.costo as costo,
        tecnologia_dificultad.dificultad.dificultad as num_dificultad,
        tecnologia_dificultad.dificultad.horas as horas
    };

    entity Tecnologias_Dificultades as select from my.Tecnologias_Dificultades {
        *,
        tecnologia.nombre as nombre_tecnologia,
        dificultad.dificultad as dificultad_del_proyecto,
        dificultad.horas as horas,
        tecnologia.costo as costo
    };

}