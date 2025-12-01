// referências aos elementos da página
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('startBtn');
 
const questionText = document.getElementById('questionText');
const answers = Array.from(document.querySelectorAll('.answer'));
const timeLeftEl = document.getElementById('timeLeft');
const scoreValueEl = document.getElementById('scoreValue');
const nextBtn = document.getElementById('nextBtn');
const endBtn = document.getElementById('endBtn');
 
let vidas = 3;
const livesEl = document.getElementById('lives');
 
function atualizarVidas() {
  const max = 3;
  const filled = "❤️".repeat(Math.max(0, Math.min(vidas, max)));
  const empty = "🤍".repeat(Math.max(0, max - Math.max(0, vidas)));
  if (livesEl) {
    livesEl.innerHTML = filled + empty;
  }
}
 
let timePerQuestion = 10;
let timerInterval = null;
let score = 0;
 
// Áudio do jogo
const gameMusic = document.getElementById('gameMusic');
 
// PERGUNTAS
const perguntas = [
  {
    pergunta: "O que pode ser reciclado infinitas vezes?",
    opcoes: ["Vidro", "Papel", "Plástico", "Metal"],
    correta: 0
  },
  {
    pergunta: "Qual é a principal causa do aquecimento global?",
    opcoes: ["Chuva forte", "Arco-íris", "Emissão de CO₂", "Vento"],
    correta: 2
  },
  {
    pergunta: "O que é considerado resíduo orgânico?",
    opcoes: ["Plástico", "Restos de comida", "Metal", "Vidro"],
    correta: 1
  },
  {
    pergunta: "Qual hábito ajuda a economizar água?",
    opcoes: ["Tomar banho longo", "Lavar calçada com mangueira", "Deixar a torneira pingando", "Fechar a torneira"],
    correta: 3
  },
  {
    pergunta: "Qual é a função essencial da Floresta Amazônica?",
    opcoes: ["Produzir carros", "Ser um deserto", "Regular o clima", "Aumentar o calor"],
    correta: 2
  },
  {
    pergunta: "Qual atividade polui o ar?",
    opcoes: ["Queima de combustíveis fósseis", "Plantas", "Vento", "Água da chuva"],
    correta: 0
  },
  {
    pergunta: "Qual material demora centenas de anos para se decompor?",
    opcoes: ["Papel", "Plástico", "Cascas de frutas", "Tecidos"],
    correta: 1
  },
  {
    pergunta: "Qual material é totalmente reciclável?",
    opcoes: ["Casca de ovo", "Madeira", "Alumínio", "Lã"],
    correta: 2
  },
  {
    pergunta: "O que aumenta a ocorrência de eventos climáticos extremos?",
    opcoes: ["Dia nublado", "Aquecimento global", "Neve", "Vento fraco"],
    correta: 1
  },
  {
    pergunta: "Qual é a cor da lixeira usada para plástico?",
    opcoes: ["Vermelho", "Azul", "Verde", "Marrom"],
    correta: 0
  },
  {
    pergunta: "Qual tipo de plástico é o mais difícil de reciclar?",
    opcoes: ["PET", "PEAD", "PP", "PVC"],
    correta: 3
  },
  {
    pergunta: "Qual gás de efeito estufa tem maior capacidade de aquecimento a curto prazo?",
    opcoes: ["Dióxido de carbono (CO₂)", "Metano (CH₄)", "Vapor d’água", "Óxido nitroso (N₂O)"],
    correta: 1
  },
  {
    pergunta: "Por que o vidro é considerado um dos melhores materiais para reciclagem?",
    opcoes: ["Porque pode ser reciclado infinitamente", "Porque não quebra", "Porque se decompõe rápido", "Porque é leve"],
    correta: 0
  },
  {
    pergunta: "O derretimento do permafrost libera qual gás?",
    opcoes: ["Oxigênio", "Hidrogênio", "Metano (CH₄)", "Hélio"],
    correta: 2
  },
  {
    pergunta: "Qual componente eletrônico é mais perigoso ao ser descartado incorretamente?",
    opcoes: ["Cabo USB", "Placa de plástico", "Carregador comum", "Bateria de lítio"],
    correta: 3
  }
];
 
let perguntaIndex = 0;
let timeLeft = timePerQuestion;
 
// iniciar jogo
function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  score = 0;
  vidas = 3;
  atualizarVidas();
  scoreValueEl.textContent = score;
  perguntaIndex = 0;
  showQuestion();
 
  // tocar música
  gameMusic.play().catch(err=>console.log("Erro ao tocar música:",err));
}
 
// limpar estados entre perguntas
function resetAnswers() {
  if (timerInterval) clearInterval(timerInterval);
  answers.forEach(btn=>{
    btn.disabled=false;
    btn.style.background='';
  });
}
 
// exibir pergunta
function showQuestion() {
  resetAnswers();
  const q = perguntas[perguntaIndex];
  questionText.textContent = q.pergunta;
  answers.forEach((btn,i)=>{
    btn.textContent=q.opcoes[i];
    btn.dataset.index=i;
  });
  timeLeft = timePerQuestion;
  timeLeftEl.textContent=timeLeft;
  nextBtn.disabled=true;
  startTimer();
}
 
// timer
function startTimer() {
  const circle=document.querySelector("#timerCircle .progress");
  const total=timePerQuestion;
  let current=total;
  circle.style.strokeDashoffset=0;
  if(timerInterval) clearInterval(timerInterval);
 
  timerInterval=setInterval(()=>{
    current--;
    timeLeftEl.textContent=current;
    const progress=(current/total)*163;
    circle.style.strokeDashoffset=163-progress;
 
    if(current<=0){
      clearInterval(timerInterval);
      timerInterval=null;
      answers.forEach(b=>b.disabled=true);
      const q=perguntas[perguntaIndex];
      answers[q.correta].style.background='#c8f7d0';
      nextBtn.disabled=false;
    }
  },1000);
}
 
// clique respostas
answers.forEach(btn=>{
  btn.addEventListener('click',()=>{
    answers.forEach(b=>b.disabled=true);
    if(timerInterval) clearInterval(timerInterval);
 
    const idx=Number(btn.dataset.index);
    const q=perguntas[perguntaIndex];
 
    if(idx===q.correta){
      btn.style.background='#c8f7d0';
      score++;
      scoreValueEl.textContent=score;
    }else{
      btn.style.background='#ffd6d6';
      answers[q.correta].style.background='#c8f7d0';
      vidas--;
      atualizarVidas();
 
      if(vidas<=0){
        setTimeout(()=>{
          gameScreen.classList.add('hidden');
          const gameOver=document.getElementById('gameOverScreen');
          gameOver.classList.remove('hidden');
 
          gameMusic.pause();
          gameMusic.currentTime=0;
        },500);
        return;
      }
    }
    nextBtn.disabled=false;
  });
});
 
// próxima pergunta
nextBtn.addEventListener('click',()=>{
  perguntaIndex++;
  if(perguntaIndex>=perguntas.length){
    gameScreen.classList.add('hidden');
    const winScreen=document.getElementById('winScreen');
    winScreen.classList.remove('hidden');
 
    document.getElementById('finalScore').textContent=score;
 
    gameMusic.pause();
    gameMusic.currentTime=0;
    return;
  }
  showQuestion();
});
 
// botão iniciar
startBtn.addEventListener('click',startGame);
 
// encerrar jogo
endBtn.addEventListener('click',()=>{
  location.reload();
  gameMusic.pause();
  gameMusic.currentTime=0;
});
 
// restart Game Over
document.getElementById('restartBtn').addEventListener('click',()=>{
  location.reload();
  gameMusic.pause();
  gameMusic.currentTime=0;
});
 
// restart Vitória
document.getElementById('restartWinBtn').addEventListener('click',()=>{
  location.reload();
  gameMusic.pause();
  gameMusic.currentTime=0;
});