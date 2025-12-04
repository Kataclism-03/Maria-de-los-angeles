const playButton = document.getElementById('playButton');
const audio = document.getElementById('loveSong');
const helperText = document.getElementById('helperText');
const equalizer = document.getElementById('equalizer');
const messageContainer = document.getElementById('messageContainer');

let hasStarted = false;
let audioReady = false;
let typingSession = 0;

const storyBlocks = [
    {
        text: 'Amor, no te prometo un camino fácil, pero sí caminarlo contigo. Porque entre todas las decisiones importantes de mi vida, tú sigues siendo la más hermosa. A pesar del ruido de afuera, de las voces que a veces confunden y del pasado que intenta opinar, mi lugar sigue siendo a tu lado. No te elijo por costumbre, te elijo porque me nace todos los días.',
    },
    {
        text: 'He aprendido que amar también es resistir, y contigo lo hago sin miedo. No te amo porque todo sea perfecto, te amo porque incluso cuando no lo es, cuando hay dudas o cansancio, igual te vuelvo a elegir. Hay historias que pesan, pasados que empujan, heridas que no siempre se ven… pero la nuestra tiene más fuerza que cualquier sombra.',
    },
    {
        text: 'No te necesito para existir, pero te quiero para vivir mejor. Tu forma de mirarme calma cosas en mí que ni yo sabía que dolían. No eres un capricho de mi vida, eres una certeza. Y aunque a veces no diga nada, aunque me quede en silencio, todo en mí te está eligiendo sin hacer ruido.',
    },
    {
        text: 'Contigo he entendido que el amor no siempre grita, a veces solo se queda. Se queda cuando hay miedo, cuando hay presión, cuando no todo es sencillo. Se queda porque quiere, no porque está obligado. Y así me quedo yo.',
    },
    {
        text: 'No te prometo eternidades perfectas, pero sí presente, todos los días. Te prometo intentarlo, cuidarte, respetarte y no soltarte a la primera tormenta. Mi lugar favorito no es un sitio, es donde estás tú. Y aunque el camino no sea fácil, incluso cuando todo tiemble, incluso cuando el mundo empuje en contra…',
    },
    {
        text: 'amor, te elijo.',
        className: 'story-line story-line-final font-script text-4xl text-golden golden-text text-center',
        speed: 95,
        pause: 1200,
    },
    {
        text: 'siempre',
        className: 'story-line text-center text-xs uppercase tracking-[0.5em] text-rose-400',
        speed: 90,
    },
];

const wait = (time = 700) => new Promise((resolve) => setTimeout(resolve, time));

const typeParagraph = (block, session) => new Promise((resolve) => {
    if (!messageContainer) return resolve();
    const paragraph = document.createElement('p');
    paragraph.className = block.className ?? 'story-line';
    paragraph.textContent = '';
    messageContainer.appendChild(paragraph);

    const baseSpeed = block.speed ?? 70;
    let index = 0;

    const typeNext = () => {
        if (session !== typingSession) {
            paragraph.remove();
            return resolve();
        }
        if (index >= block.text.length) {
            return resolve();
        }

        paragraph.textContent += block.text[index];
        const currentChar = block.text[index];
        index += 1;

        let delay = baseSpeed + Math.random() * 25;
        if ('.!?…'.includes(currentChar)) {
            delay += 520;
        } else if (currentChar === ',') {
            delay += 220;
        } else if (currentChar === ' ') {
            delay += 10;
        }

        setTimeout(typeNext, delay);
    };

    setTimeout(typeNext, 400);
});

const typeStory = async () => {
    typingSession += 1;
    const session = typingSession;
    if (!messageContainer) return;
    messageContainer.innerHTML = '';

    for (const block of storyBlocks) {
        await typeParagraph(block, session);
        await wait(block.pause ?? 900);
    }
};

const setButtonState = (state) => {
    if (!playButton) return;

    if (state === 'playing') {
        playButton.textContent = 'Reiniciar la carta';
        playButton.disabled = false;
        playButton.classList.add('opacity-80');
    } else if (state === 'ready') {
        playButton.textContent = 'Encender la canción';
        playButton.disabled = false;
        playButton.classList.remove('opacity-80');
    } else if (state === 'error') {
        playButton.textContent = 'Intenta de nuevo';
        playButton.disabled = false;
        playButton.classList.remove('opacity-80');
    }
};

const toggleEqualizer = (isActive) => {
    if (!equalizer) return;
    if (isActive) {
        equalizer.classList.remove('hidden');
        equalizer.classList.add('is-active');
    } else {
        equalizer.classList.remove('is-active');
        equalizer.classList.add('hidden');
    }
};

const verifyAudioSource = async () => {
    if (!audio?.src) return;
    try {
        const response = await fetch(audio.src, { method: 'HEAD' });
        if (!response.ok) throw new Error('Audio no encontrado');
        audioReady = true;
        helperText?.classList.add('text-emerald-500');
        if (helperText) helperText.textContent = 'Listo. Baja la luz, sube el volumen y toca el botón para comenzar.';
    } catch (error) {
        console.error('Verificación de audio falló:', error);
        audioReady = false;
        helperText?.classList.remove('text-emerald-500');
        if (helperText) helperText.textContent = 'No encuentro el archivo en assets/audio/cancion.mp3. Verifica el nombre y vuelve a cargar la página.';
    }
};

const resetExperience = (preserveHelper = false) => {
    typingSession += 1;
    hasStarted = false;
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    toggleEqualizer(false);
    if (!preserveHelper) {
        helperText?.classList.remove('text-emerald-500');
        if (helperText) helperText.textContent = 'Listo para volver a empezar cuando quieras.';
    }
    if (messageContainer) {
        messageContainer.innerHTML = '';
    }
    setButtonState('ready');
};

const startExperience = async () => {
    if (!audio || !playButton) return;
    if (hasStarted) return;
    if (!audioReady) await verifyAudioSource();
    if (!audioReady) return;
    try {
        audio.load();
        await audio.play();
        hasStarted = true;
        setButtonState('playing');
        toggleEqualizer(true);
        helperText?.classList.add('text-emerald-500');
        if (helperText) helperText.textContent = 'Sube el volumen y deja que cada frase haga el resto.';
        typeStory();
    } catch (error) {
        console.error('No se pudo reproducir el audio:', error);
        setButtonState('error');
        helperText?.classList.remove('text-emerald-500');
        if (helperText) helperText.textContent = 'Parece que el navegador bloqueó el audio. Activa el sonido y vuelve a tocar.';
    }
};

const handlePlayClick = async () => {
    if (hasStarted) {
        resetExperience(true);
    }
    await startExperience();
};

playButton?.addEventListener('click', handlePlayClick);

audio?.addEventListener('ended', () => {
    setButtonState('ready');
    toggleEqualizer(false);
    hasStarted = false;
    helperText?.classList.add('text-slate-500');
    if (helperText) helperText.textContent = 'Si quieres volver a escucharlo, toca el botón otra vez.';
});

window.addEventListener('load', verifyAudioSource);
