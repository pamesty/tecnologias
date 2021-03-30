const cds = require('@sap/cds');
const { Tecnologias_Dificultades, Proyecto_Tecnologia } = cds.entities;

module.exports = cds.service.impl (async (srv) => {

    // Ingresar un proyecto y verificar que no se repita una tecnología
    srv.after('CREATE','Proyectos', async (data, req) => {

        const { ID } = data;

        let { Tecnologias } = req._.req.query;

        // Dividiendo las URL en 1 arreglo y a su vez divirlo para sacar los ID de las 2 tablas distintas (tecnologias y dificultades)
        let arregloCompleto = Tecnologias.split("@");
        let arregloTecnologia = arregloCompleto[0].toString();
        let arregloDificultad = arregloCompleto[1].toString();

        arregloTecnologia = arregloTecnologia.split(";");
        arregloDificultad = arregloDificultad.split(";");
        

        try {
            if (arregloTecnologia[0] === arregloTecnologia[1]) { // en el hipotético caso de que sólo se permitieran 2 tecnologías
                // Para probar con error ---->>> http://localhost:4004/my-app/Proyectos?Tecnologias=b48761c9-5325-48ba-af70-68e0e15d21a6;b48761c9-5325-48ba-af70-68e0e15d21a6@f3d137b1-2fef-4a40-8f78-71cc6ff0c692;9e8d6bfa-f533-4e53-bc4e-2f7c8366cc95
                console.log("Para un proyecto sólo se puede tener 1 dificultad por tecnología");
                return;
            }


            // Para probar correctamente --->>> http://localhost:4004/my-app/Proyectos?Tecnologias=b48761c9-5325-48ba-af70-68e0e15d21a6;39f97930-6f8d-4b00-a87e-1380b41896a7@f3d137b1-2fef-4a40-8f78-71cc6ff0c692;9e8d6bfa-f533-4e53-bc4e-2f7c8366cc95

            let datosACargar = [];
            let consultarTecnologia = "";

            for (let i = 0; i < arregloTecnologia.length; i++) {

                //consultar los datos en la entidad Tecnologias_Dificultades para traer el ID de su relación
                consultarTecnologia = await cds.run(SELECT('ID').one.from(Tecnologias_Dificultades).where({ tecnologia_ID: arregloTecnologia[i]}, {and: {dificultad_ID: arregloDificultad[i] }}));
                
                //llenar un arreglo con los datos a cargar en el INSERT de de la entidad Proyecto_Tecnologia
                datosACargar.push({
                    proyecto_ID : ID,
                    tecnologia_dificultad_ID : consultarTecnologia.ID
                });
                
            }

            await cds.run(INSERT.into(Proyecto_Tecnologia).entries(datosACargar));
            console.log("Datos Cargados, relacionando el proyecto con su tecnologia y dificultad");
            
        } catch (error) {
            console.log(error);
            return `Explotus`;
        }

    });

});