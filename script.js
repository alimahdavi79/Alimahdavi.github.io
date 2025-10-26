
        // فعال‌سازی کتابخانه انیمیشن‌ها
        AOS.init({
            duration: 800,
            once: true,
            disable: false
        });

        // تابع اصلی برای شروع تجربه و ورود به سایت
        function startExperience() {
            const mainSong = document.getElementById('my-song');
            const gate = document.getElementById('entry-gate');
            const content = document.getElementById('main-content');

            mainSong.play().catch(error => {
                console.log("پخش خودکار ممکن است توسط مرورگر مسدود شده باشد.");
            });

            gate.style.transition = 'opacity 0.5s ease';
            gate.style.opacity = '0';
            setTimeout(() => {
                gate.style.display = 'none';
            }, 500);

            content.style.display = 'block';
             // اطمینان از مقداردهی اولیه آیکون صدا
             try { // اضافه کردن try-catch برای جلوگیری از خطا اگر عنصر پیدا نشد
                const iconVolumeOn = document.querySelector('#master-volume-btn .icon-volume-on');
                const iconVolumeOff = document.querySelector('#master-volume-btn .icon-volume-off');
                if (iconVolumeOn && iconVolumeOff) {
                     iconVolumeOn.style.display = mainSong.muted ? 'none' : 'block';
                     iconVolumeOff.style.display = mainSong.muted ? 'block' : 'none';
                }
             } catch(e) { console.error("خطا در تنظیم اولیه آیکون صدا:", e); }
        }

        // --- کد نهایی و کامل برای جعبه موسیقی با کنترلرها ---
        document.addEventListener('DOMContentLoaded', function() {
            // این کد بعد از بارگذاری کامل صفحه اجرا می‌شود

             // اطمینان از وجود عناصر قبل از استفاده
            const mainSong = document.getElementById('my-song');
            const playlistPlayer = document.getElementById('playlist-audio-player');
            const lyricsDisplay = document.getElementById('lyrics-display-box');
            const songButtons = document.querySelectorAll('.song-choice-btn');
            const defaultLyrics = lyricsDisplay ? lyricsDisplay.innerHTML : "<p>خطا در بارگذاری متن.</p>";
            const playPauseBtn = document.getElementById('master-play-pause-btn');
            const stopBtn = document.getElementById('master-stop-btn');
            const volumeBtn = document.getElementById('master-volume-btn');
            const iconPlay = playPauseBtn ? playPauseBtn.querySelector('.icon-play') : null;
            const iconPause = playPauseBtn ? playPauseBtn.querySelector('.icon-pause') : null;
            const iconVolumeOn = volumeBtn ? volumeBtn.querySelector('.icon-volume-on') : null;
            const iconVolumeOff = volumeBtn ? volumeBtn.querySelector('.icon-volume-off') : null;
            let isPlaylistActive = false;

            // بررسی وجود تمام عناصر ضروری
            if (!mainSong || !playlistPlayer || !lyricsDisplay || !playPauseBtn || !stopBtn || !volumeBtn || !iconPlay || !iconPause || !iconVolumeOn || !iconVolumeOff) {
                console.error("خطا: یک یا چند عنصر ضروری موسیقی یافت نشد.");
                return; // ادامه نده اگر عناصر اصلی وجود ندارند
            }

            function updatePlayPauseIcon(isPlaying) {
                 if (!iconPause || !iconPlay) return; // بررسی مجدد
                 iconPause.style.display = isPlaying ? 'block' : 'none';
                 iconPlay.style.display = isPlaying ? 'none' : 'block';
            }

            songButtons.forEach(button => {
                button.addEventListener('click', function() {
                    mainSong.pause();
                    isPlaylistActive = true;
                    const songSrc = this.getAttribute('data-song-src');
                    const lyricsId = this.getAttribute('data-lyrics-id');
                    const lyricsElement = document.getElementById(lyricsId);
                    songButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    if (lyricsElement) {
                        lyricsDisplay.innerHTML = lyricsElement.innerHTML;
                    } else {
                         lyricsDisplay.innerHTML = "<p>متن این آهنگ یافت نشد.</p>";
                    }
                    playlistPlayer.src = songSrc;
                    playlistPlayer.play().catch(e => console.error("خطا در پخش آهنگ لیست:", e)); // اضافه کردن catch
                });
            });

            playPauseBtn.addEventListener('click', function() {
                const activePlayer = isPlaylistActive ? playlistPlayer : mainSong;
                if (activePlayer.paused) {
                    activePlayer.play().catch(e => console.error("خطا در پخش:", e));
                } else {
                    activePlayer.pause();
                }
            });

            stopBtn.addEventListener('click', function() {
                playlistPlayer.pause();
                playlistPlayer.currentTime = 0;
                isPlaylistActive = false;
                songButtons.forEach(btn => btn.classList.remove('active'));
                lyricsDisplay.innerHTML = defaultLyrics;
                mainSong.currentTime = 0;
                // بعد از استاپ، آهنگ اصلی را دوباره پلی می‌کنیم (اگر خواستید، می‌توانید این خط را حذف کنید)
                mainSong.play().catch(e => console.error("خطا در پخش آهنگ اصلی بعد از استاپ:", e));
            });

            volumeBtn.addEventListener('click', function() {
                const isMuted = mainSong.muted;
                mainSong.muted = !isMuted;
                playlistPlayer.muted = !isMuted; // همگام‌سازی میوت
                 if (!iconVolumeOn || !iconVolumeOff) return; // بررسی مجدد
                iconVolumeOn.style.display = isMuted ? 'block' : 'none';
                iconVolumeOff.style.display = isMuted ? 'none' : 'block';
            });

            // رویدادهای مربوط به پخش و توقف پلیرها
            mainSong.onplay = () => { if (!isPlaylistActive) updatePlayPauseIcon(true); };
            mainSong.onpause = () => { if (!isPlaylistActive) updatePlayPauseIcon(false); };
            playlistPlayer.onplay = () => { if (isPlaylistActive) updatePlayPauseIcon(true); };
            playlistPlayer.onpause = () => { if (isPlaylistActive) updatePlayPauseIcon(false); };

             // رویداد پایان آهنگ در لیست پخش
            playlistPlayer.onended = () => {
                isPlaylistActive = false;
                songButtons.forEach(btn => btn.classList.remove('active'));
                lyricsDisplay.innerHTML = defaultLyrics;
                // بعد از اتمام آهنگ لیست، آهنگ اصلی را از اول پلی می‌کنیم
                mainSong.currentTime = 0;
                mainSong.play().catch(e => console.error("خطا در پخش آهنگ اصلی بعد از اتمام لیست:", e));
            };

            // مقداردهی اولیه آیکون صدا بر اساس وضعیت اولیه
            if (iconVolumeOn && iconVolumeOff) {
                iconVolumeOn.style.display = mainSong.muted ? 'none' : 'block';
                iconVolumeOff.style.display = mainSong.muted ? 'block' : 'none';
            }
             // مقداردهی اولیه آیکون Play/Pause (فرض می‌کنیم اول آهنگ اصلی پخش نمی‌شود تا کاربر دکمه ورود را بزند)
             updatePlayPauseIcon(false);

        });

        // --- منطق لایت‌باکس برای بزرگنمایی عکس‌ها ---
        // (این بخش بدون تغییر باقی می‌ماند)
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-button');
        document.querySelectorAll('.zoom-icon, .polaroid-card').forEach(item => {
            item.addEventListener('click', (event) => {
                event.stopPropagation();
                const imageSrc = item.classList.contains('zoom-icon') ? item.previousElementSibling.src : item.querySelector('img').src;
                lightbox.style.display = 'block';
                lightboxImg.src = imageSrc;
            });
        });
        if (closeBtn) { // بررسی وجود دکمه بستن
           closeBtn.onclick = () => lightbox.style.display = 'none';
        }
        if (lightbox) { // بررسی وجود لایت باکس
           lightbox.onclick = (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; };
        }

        // --- شمارش معکوس ---
         const countdownDate = new Date("Oct 26, 2026 00:00:00").getTime(); // تاریخ را چک کن
         const daysEl = document.getElementById("days");
         const hoursEl = document.getElementById("hours");
         const minutesEl = document.getElementById("minutes");
         const secondsEl = document.getElementById("seconds");
         const countdownContainer = document.getElementById("countdown");

        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            if (daysEl && hoursEl && minutesEl && secondsEl) { // بررسی وجود عناصر
                daysEl.innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
                hoursEl.innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutesEl.innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                secondsEl.innerText = Math.floor((distance % (1000 * 60)) / 1000);
            }

            if (distance < 0) {
                clearInterval(countdownInterval);
                 if (countdownContainer) { // بررسی وجود کانتینر
                   countdownContainer.innerHTML = "<h2>رویداد ما فرا رسیده! ❤️</h2>";
                 }
            }
        }, 1000);

        // --- انیمیشن قلب‌های شناور ---
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '&#10084;';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (5 + Math.random() * 5) + 's';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 10000);
        }, 800);

        // --- افکت ذرات پس‌زمینه ---
         // اطمینان از وجود تابع particlesJS قبل از فراخوانی
        if (typeof particlesJS === 'function') {
            particlesJS("main-content", { /* تنظیمات مثل قبل */
                "particles": { "number": { "value": 50, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#c88ca4" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1 } }, "size": { "value": 3, "random": true }, "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out" } },
                "interactivity": { "events": { "onhover": { "enable": false }, "onclick": { "enable": false } } }
            });
        } else {
            console.warn("کتابخانه particles.js بارگذاری نشده است.");
        }

        // --- کد بخش نامه‌ها (آکاردئون) ---
        document.querySelectorAll(".accordion").forEach(acc => {
            acc.addEventListener("click", function() {
                this.classList.toggle("active");
                const panel = this.nextElementSibling;
                // اطمینان از وجود panel
                if (panel) {
                   panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
                }
            });
        });

         // --- کد جدید برای آزمون "چقدر منو می‌شناسی؟" ---
         // این کد باید فقط یک بار اجرا شود، آن را به داخل DOMContentLoaded منتقل می‌کنیم یا مطمئن می‌شویم تکراری نیست
         // (قبلاً در بالا داخل DOMContentLoaded قرار داده شده، پس این تکراری است و باید حذف شود یا در جای مناسب قرار گیرد)
         // برای جلوگیری از خطا، آن را داخل همان DOMContentLoaded اولیه قرار می‌دهیم
         document.addEventListener('DOMContentLoaded', function() {
             const quizBox = document.getElementById('quiz-box');
             const quizResult = document.getElementById('quiz-result');

              // بررسی وجود عناصر آزمون
             if (!quizBox || !quizResult) {
                 console.error("خطا: عناصر آزمون یافت نشدند.");
                 return;
             }

             const questions = [
                 { question: "اولین هدیه‌ای که برات گرفتم چی بود؟", options: ["عطر", "کتاب شعر", "یک شاخه گل رز", "خرس"] },
                 { question: "رنگ مورد علاقه من کدومه؟", options: ["آبی", "سبز", "مشکی", "بنفش"] },
                 { question: "اگه قرار باشه یه سفر بریم، کدوم رو انتخاب می‌کنم؟", options: ["جنگل و کلبه چوبی", "ساحل و دریا", "شهر تاریخی و موزه", "سفر به یک کشور جدید"] },
                 { question: "ترس بزرگ من چیه؟", options: ["ارتفاع", "تاریکی", "تنهایی", "حیوانات خاص"] }
             ];
             let currentQuestionIndex = 0;

             function showQuestion(index) {
                 if (index >= questions.length) {
                     quizBox.style.display = 'none';
                     quizResult.style.display = 'block';
                     return;
                 }
                 const q = questions[index];
                 quizBox.innerHTML = `
                     <p class="quiz-question">${q.question}</p>
                     <div class="quiz-options">
                         ${q.options.map(option => `<button class="quiz-option-btn">${option}</button>`).join('')}
                     </div>`;
                 document.querySelectorAll('.quiz-option-btn').forEach(button => {
                     button.addEventListener('click', () => {
                         currentQuestionIndex++;
                         showQuestion(currentQuestionIndex);
                     });
                 });
             }
             showQuestion(currentQuestionIndex);
         });
