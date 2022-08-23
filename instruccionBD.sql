CREATE TABLE transferencias
(descripcion varchar(50), fecha varchar(10), monto DECIMAL,
cuenta_origen INT, cuenta_destino INT);

ALTER TABLE transferencias ALTER COLUMN fecha SET DATA TYPE varchar(30); 

CREATE TABLE cuentas (id INT , saldo DECIMAL CHECK (saldo >= 0) );

INSERT INTO cuentas values (1, 20000);
INSERT INTO cuentas values (2, 10000);

SELECT * FROM cuentas