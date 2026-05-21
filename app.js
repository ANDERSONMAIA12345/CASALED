// =========================
// CONEXÃO MQTT
// =========================

const client = mqtt.connect(
'wss://broker.hivemq.com:8884/mqtt'
);

// =========================
// TÓPICOS MQTT
// =========================

const topicoEnviar =
'casa/ledSalvar';

const topicoReceber =
'casa/ledSalvo';

// =========================
// ELEMENTOS HTML
// =========================

const led =
document.getElementById('led');

const statusText =
document.getElementById('status');

const alarme =
document.getElementById('alarme');

const botoes =
document.querySelectorAll('button');

// =========================
// VERIFICAÇÃO
// =========================

if (
!led ||
!statusText ||
!alarme ||
botoes.length === 0
) {

  console.error(
  'Elementos HTML não encontrados'
  );

}

// =========================
// LIBERA ÁUDIO NO CELULAR
// =========================

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

  .catch((erro) => {

    console.log(
    'Erro ao liberar áudio:',
    erro
    );

  });

},

{ once: true }

);

// =========================
// CONECTOU MQTT
// =========================

client.on(
'connect',

() => {

  console.log(
  'MQTT conectado'
  );

  // Status
  statusText.innerHTML =
  'Conectado ✔';

  // Habilita botões
  botoes.forEach((btn) => {

    btn.disabled = false;

  });

  // Escuta tópico
  client.subscribe(
  topicoReceber
  );

}

);

// =========================
// RECEBE MENSAGENS MQTT
// =========================

client.on(
'message',

(topic, message) => {

  const msg =
  message.toString();

  console.log(
  'Mensagem recebida:',
  msg
  );

  // =====================
  // LED LIGADO
  // =====================

  if(msg === '1') {

    console.log(
    'LED LIGADO'
    );

    // LED verde
    led.classList.remove('off');

    led.classList.add('on');

    // Reinicia áudio
    alarme.pause();

    alarme.currentTime = 0;

    // Toca alarme
    alarme.play()

    .then(() => {

      console.log(
      'Alarme tocando'
      );

    })

    .catch((erro) => {

      console.log(
      'Erro ao tocar alarme:',
      erro
      );

    });

    // =====================
    // ENVIA PARA KODULAR
    // =====================

    if(window.AppInventor) {

      window.AppInventor.setWebViewString(
      'ALARME_ON'
      );

      console.log(
      'Enviado para Kodular: ALARME_ON'
      );

    }

  }

  // =====================
  // LED DESLIGADO
  // =====================

  if(msg === '0') {

    console.log(
    'LED DESLIGADO'
    );

    // LED apagado
    led.classList.remove('on');

    led.classList.add('off');

    // Para áudio
    alarme.pause();

    alarme.currentTime = 0;

    // =====================
    // ENVIA PARA KODULAR
    // =====================

    if(window.AppInventor) {

      window.AppInventor.setWebViewString(
      'ALARME_OFF'
      );

      console.log(
      'Enviado para Kodular: ALARME_OFF'
      );

    }

  }

}

);

// =========================
// ERRO MQTT
// =========================

client.on(
'error',

(err) => {

  console.error(
  'Erro MQTT:',
  err
  );

  statusText.innerHTML =
  'Erro MQTT ❌';

  // Desabilita botões
  botoes.forEach((btn) => {

    btn.disabled = true;

  });

}

);

// =========================
// DESCONECTOU
// =========================

client.on(
'close',

() => {

  console.log(
  'MQTT desconectado'
  );

  statusText.innerHTML =
  'Desconectado ⚠️';

  // Desabilita botões
  botoes.forEach((btn) => {

    btn.disabled = true;

  });

}

);

// =========================
// ENVIAR MQTT
// =========================

function sendMessage(valor) {

  // Verifica conexão
  if(!client.connected) {

    console.warn(
    'MQTT não conectado'
    );

    return;
  }

  console.log(
  'Enviando:',
  valor
  );

  // Desabilita botões
  botoes.forEach((btn) => {

    btn.disabled = true;

  });

  // Publica MQTT
  client.publish(
  topicoEnviar,
  valor
  );

  // Reabilita após 300ms
  setTimeout(() => {

    if(client.connected) {

      botoes.forEach((btn) => {

        btn.disabled = false;

      });

    }

  }, 300);

}
