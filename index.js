const {Pool} = require ('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    password: '1234',
    database: 'banco2',
}

//Req 1. Crear una función asíncrona que registre una nueva transferencia utilizando una transacción SQL. 
// Debe mostrar por consola la última transferencia registrada.

/* 4. En caso de haber un error en una transacción SQL, se debe retornar el error por
consola. */

const pool = new Pool(config);
const nuevaTransferencia = async({descripcion,fecha,monto,cuenta_origen,cuenta_destino})=> {
    try {
        await pool.query (`BEGIN`)
         //ACTUALIZAR LOS SALDOS EN CUENTA ORIGEN Y CUENTA DESTINO
        await pool.query(`UPDATE cuentas SET saldo = saldo - ${monto} WHERE id='${cuenta_origen}' RETURNING *;`) 
        await pool.query(`UPDATE cuentas SET saldo = saldo + ${monto} WHERE id='${cuenta_destino}' RETURNING *;`) 
    //INSERTAR LA TRANSFERENCIA
    const res = await pool.query(`INSERT INTO transferencias(descripcion,fecha,monto,cuenta_origen,cuenta_destino) 
    VALUES('${descripcion}','${fecha}','${monto}','${cuenta_origen}','${cuenta_destino}') RETURNING *;`)
    console.log(res.rows[0]);
        await pool.query (`COMMIT`)
        console.log('transacción realizada con éxito')
        console.log('Transferencia Realizada',res.rows[0])
        //consultaTransfer(1);
        //consultaCuenta(2);
    } catch (error) {
        await pool.query (`ROLLBACK`)
        throw error
    }
} 

//nuevaTransferencia('Transfer 1','29-03-2022',1000,1,4)
//nuevaTransferencia ('Transfer 2','29-03-2022',200,1,2)
//nuevaTransferencia ('Transfer 3','29-03-2022',200,1,2)
//nuevaTransferencia ('Transfer 4','29-03-2022',200,1,2)
//nuevaTransferencia ('Transfer 5','29-03-2022',200,1,2)
//nuevaTransferencia ('Transfer 6','29-03-2022',200,2,1)
//nuevaTransferencia ('Transfer 7','29-03-2022',200,2,1)
//nuevaTransferencia ('Transfer 8','29-03-2022',200,2,1)
//nuevaTransferencia ('Transfer 9','29-03-2022',200,1,2)
//nuevaTransferencia ('Transfer 10','29-03-2022',200,2,1)
//nuevaTransferencia ('Transfer 11','29-03-2022',200,2,1)
//nuevaTransferencia ('Transfer 12','29-03-2022',200,1,2)

/* 2. Realizar una función asíncrona que consulte la tabla de transferencias y retorne los
últimos 10 registros de una cuenta en específico. */

const consultaCuenta = async ({ cuenta_origen }) => {
    // pasar la query de manera literal en el metodo pool.query, y destructuring para tomar rows
    const { rows } = await pool.query(`select * from transferencias where cuenta_origen = ${cuenta_origen} ORDER BY fecha DESC LIMIT 10;`);
  
    // imprimimos el resultado de rows
    console.log(` Las ultimas 10 transferencias de la cuenta ${cuenta_origen} son:`);
    console.log(rows);
  };
  
//consulta ({cuenta_origen:2})


/* 3. Realizar una función asíncrona que consulte el saldo de una cuenta en específico. */
const saldoCuenta = async({id})=>{
    //EJECUTAR CONSULTA DE SALDO DE CUENTA
    const res = await pool.query(`SELECT * FROM cuentas WHERE id = ${id}`)
    //console.log(res.rows[0].saldo);
    if (res.rowCount == 0){
      throw 'cuenta no encontrada' 
    }else {
    const {saldo} = res.rows[0];
    console.log(`el saldo de la cuenta ${id} es igual a ${saldo}`);
}
}
//saldoCuenta({id:1})


/* Ejecución de las funciones */
nuevaTransferencia({
    descripcion:'transferencia 99',
    fecha: '04/12/2022',
    monto:300,
    cuenta_origen:1,
    cuenta_destino:2})
            //Consulta saldo
.then ( () => consultaCuenta({cuenta_origen: 1}) )
            //Consulta transferencias
.then ( () => saldoCuenta({id: 1}) ) 



