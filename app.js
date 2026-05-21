// Conecta no HiveMQ
const client = mqtt.connect(
'wss://broker.hivemq.com:8884/mqtt'
);

// Tópicos MQTT
const topicoEnviar =
'casa/ledSalvar';

const topicoReceber =
'casa/ledSalvo';

// Elementos HTML
const led =
document.getElementById('led');

const statusText =
document.getElementById('status');

const alarme =
document.getElementById('alarme');

// Conectou no MQTT
client.on('connect', () => {

  console.log('MQTT conectado');

  statusText.innerHTML =
  'Conectado ✔';

  // Escuta mensagens
  client.subscribe(topicoReceber);

});

// Recebe mensagens
client.on('message',
(topic, message) => {

  const msg =
  message.toString();

  console.log(
  'Recebido:',
  msg
  );

  // LED ON
  if(msg === '1') {

    led.classList.remove('off');
    led.classList.add('on');

    // toca alarme
    alarme.play();

  }

  // LED OFF
  if(msg === '0') {

    led.classList.remove('on');
    led.classList.add('off');

    // para alarme
    alarme.pause();

    alarme.currentTime = 0;
  }

});

// Envia comando MQTT
function sendMessage(valor) {

  console.log(
  'Enviado:',
  valor
  );

  client.publish(
  topicoEnviar,
  valor
  );
}