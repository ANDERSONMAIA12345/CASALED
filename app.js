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

const botoes =
document.querySelectorAll('button');

// Validação de elementos
if (!led || !statusText || !alarme || botoes.length === 0) {

  console.error(
  'Erro: Elementos HTML não encontrados'
  );
}

// Libera áudio no celular/navegador
document.body.addEventListener(
'click',
() => {

  alarme.play()
  .then(() => {

    alarme.pause();

    alarme.currentTime = 0;

    console.log(
    'Áudio liberado'
    );

  })
  .catch(err => {

    console.log(
    'Erro ao liberar áudio:',
    err
    );

  });

},
{ once: true }
);

// Conectou no MQTT
client.on('connect', () => {

  console.log('MQTT conectado');

  if (statusText) {

    statusText.innerHTML =
    'Conectado ✔';
  }

  // Habilita botões
  botoes.forEach(btn => {

    btn.disabled = false;

  });

  // Escuta mensagens
  client.subscribe(topicoReceber);

});

// Recebe mensagens
client.on(
'message',
(topic, message) => {

  const msg =
  message.toString();

  console.log(
  'Recebido:',
  msg
  );

  if (!led || !alarme) return;

  // LED ON
  if(msg === '1') {

    led.classList.remove('off');

    led.classList.add('on');

    // Reinicia áudio
    alarme.currentTime = 0;

    // Toca alarme
    alarme.play()
    .then(() => {

      console.log(
      'Alarme tocando'
      );

    })
    .catch(err => {

      console.log(
      'Erro ao tocar áudio:',
      err
      );

    });

  }

  // LED OFF
  if(msg === '0') {

    led.classList.remove('on');

    led.classList.add('off');

    // Para áudio
    alarme.pause();

    alarme.currentTime = 0;

    console.log(
    'Alarme parado'
    );

  }

});

// Erro MQTT
client.on('error', (err) => {

  console.error(
  'Erro MQTT:',
  err
  );

  if (statusText) {

    statusText.innerHTML =
    'Erro na conexão ❌';
  }

  // Desabilita botões
  botoes.forEach(btn => {

    btn.disabled = true;

  });

});

// Desconectado
client.on('disconnect', () => {

  console.log(
  'MQTT desconectado'
  );

  if (statusText) {

    statusText.innerHTML =
    'Desconectado ⚠️';
  }

  // Desabilita botões
  botoes.forEach(btn => {

    btn.disabled = true;

  });

});

// Envia comando MQTT
function sendMessage(valor) {

  if (!client.connected) {

    console.warn(
    'MQTT não conectado'
    );

    return;
  }

  // Desabilita botões
  botoes.forEach(btn => {

    btn.disabled = true;

  });

  console.log(
  'Enviado:',
  valor
  );

  client.publish(
  topicoEnviar,
  valor
  );

  // Reabilita botões
  setTimeout(() => {

    if (client.connected) {

      botoes.forEach(btn => {

        btn.disabled = false;

      });

    }

  }, 300);
}
