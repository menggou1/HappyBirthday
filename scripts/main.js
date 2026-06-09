(function() {
    const timelineData = window.timelineData || [];

    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const page3 = document.getElementById('page3');
    const btnEnter = document.getElementById('btnEnter');
    const cakeIcon = document.getElementById('cakeIcon');
    const bigHeart = document.getElementById('bigHeart');
    const btnToTimeline = document.getElementById('btnToTimeline');
    const btnBackTop = document.getElementById('btnBackTop');
    const timelineScroll = document.getElementById('timelineScroll');
    const timelineDetail = document.getElementById('timelineDetail');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const heartsLayer = document.getElementById('heartsLayer');
    const sparklesLayer = document.getElementById('sparklesLayer');

    let currentPage = 1;
    let isTransitioning = false;
    let activeTimelineIndex = 0;

    function isTimelineDisabled(index) {
        return Boolean(timelineData[index] && timelineData[index].disabled);
    }

    function findFirstEnabledIndex() {
        return timelineData.findIndex(item => !item.disabled);
    }

    function findNextEnabledIndex(startIndex, direction) {
        let index = startIndex;
        for (let step = 0; step < timelineData.length; step++) {
            index += direction;
            if (index < 0 || index >= timelineData.length) {
                return -1;
            }
            if (!isTimelineDisabled(index)) {
                return index;
            }
        }
        return -1;
    }

    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'falling-heart';
        const heartEmojis = ['❤️', '💕', '💗', '💖', '💝', '💘', '🩷', '♥️', '💓', '💞', '🌸', '✨'];
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 95 + '%';
        heart.style.fontSize = (Math.random() * 26 + 14) + 'px';
        heart.style.animationDuration = (Math.random() * 7 + 7) + 's';
        heart.style.animationDelay = '0s';
        heart.style.opacity = '0';
        heartsLayer.appendChild(heart);

        requestAnimationFrame(() => {
            heart.style.opacity = '';
        });

        const duration = parseFloat(heart.style.animationDuration) * 1000;
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, duration + 200);
    }

    function startHeartRain() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => spawnHeart(), i * 180);
        }
        setInterval(() => {
            if (document.hidden) return;
            spawnHeart();
        }, 900);
    }

    function spawnSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        const size = Math.random() * 8 + 3;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.background =
            `radial-gradient(circle, rgba(255,220,200,1) 0%, rgba(255,180,160,0.6) 50%, transparent 100%)`;
        sparkle.style.animationDuration = (Math.random() * 2 + 1.8) + 's';
        sparklesLayer.appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode) sparkle.remove();
        }, 3500);
    }

    let sparkleThrottle = 0;
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth < 768) return;
        sparkleThrottle++;
        if (sparkleThrottle % 3 === 0) {
            spawnSparkle(e.clientX, e.clientY);
        }
    });

    document.addEventListener('touchmove', function(e) {
        if (sparkleThrottle % 5 === 0 && e.touches.length > 0) {
            spawnSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
        sparkleThrottle++;
    }, { passive: true });

    document.addEventListener('click', function(e) {
        for (let i = 0; i < 6; i++) {
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;
            spawnSparkle(e.clientX + offsetX, e.clientY + offsetY);
        }
    });

    function switchPage(fromPageNum, toPageNum) {
        if (isTransitioning) return;
        if (fromPageNum === toPageNum) return;
        isTransitioning = true;

        const pages = { 1: page1, 2: page2, 3: page3 };
        const fromPage = pages[fromPageNum];
        const toPage = pages[toPageNum];

        fromPage.classList.remove('page-active');
        fromPage.classList.add('page-exiting-up');

        toPage.classList.remove('page-hidden', 'page-exiting-up');
        toPage.classList.add('page-active');

        if (toPageNum === 2) {
            resetLoveTextAnimation();
        }

        if (toPageNum === 3) {
            initTimeline();
        }

        currentPage = toPageNum;

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            fromPage.classList.remove('page-exiting-up');
            fromPage.classList.add('page-hidden');
            isTransitioning = false;
        }, 700);
    }

    function resetLoveTextAnimation() {
        const lines = document.querySelectorAll('.love-text .line');
        lines.forEach(line => {
            line.style.animation = 'none';
            line.style.opacity = '0';
            line.style.transform = 'translateY(18px)';
            line.offsetHeight;
            line.style.animation = '';
        });
    }

    function goToPage2() {
        if (currentPage !== 1 || isTransitioning) return;
        switchPage(1, 2);
    }

    function goToPage3() {
        if (currentPage !== 2 || isTransitioning) return;
        switchPage(2, 3);
    }

    function goToPage1() {
        if (currentPage !== 3 || isTransitioning) return;
        switchPage(3, 1);
    }

    btnEnter.addEventListener('click', goToPage2);
    cakeIcon.addEventListener('click', goToPage2);
    bigHeart.addEventListener('click', goToPage3);
    btnToTimeline.addEventListener('click', goToPage3);
    btnBackTop.addEventListener('click', goToPage1);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            if (currentPage === 1) {
                e.preventDefault();
                goToPage2();
            } else if (currentPage === 2) {
                e.preventDefault();
                goToPage3();
            } else if (currentPage === 3) {
                e.preventDefault();
                navigateTimeline(1);
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentPage === 2) {
                e.preventDefault();
                goToPage1();
            } else if (currentPage === 3) {
                e.preventDefault();
                navigateTimeline(-1);
            }
        }
    });

    function buildTimelineNodes() {
        timelineScroll.innerHTML = '';
        
        // 创建背景连接线
        const axisTrack = document.createElement('div');
        axisTrack.className = 'timeline-axis-track';
        axisTrack.innerHTML = '<span class="timeline-axis-line"></span>';
        timelineScroll.appendChild(axisTrack);

        timelineData.forEach((data, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'timeline-node-wrapper';
            if (data.disabled) {
                wrapper.classList.add('is-disabled');
                wrapper.setAttribute('aria-disabled', 'true');
                wrapper.setAttribute('tabindex', '-1');
            } else {
                wrapper.setAttribute('tabindex', '0');
            }
            wrapper.setAttribute('data-index', index);
            wrapper.innerHTML = `
                    <div class="timeline-node-dot" aria-hidden="true"></div>
                    <span class="timeline-node-label">${data.month}</span>
                `;
            if (!data.disabled) {
                wrapper.addEventListener('click', () => {
                    setActiveTimelineNode(index);
                    scrollToNode(index);
                });
            }
            timelineScroll.appendChild(wrapper);
        });

        // 确保连接线宽度覆盖所有节点
        requestAnimationFrame(() => {
            const track = timelineScroll.querySelector('.timeline-axis-track');
            if (track) {
                track.style.width = Math.max(timelineScroll.scrollWidth, timelineScroll.offsetWidth) + 'px';
            }
        });
    }

    function setActiveTimelineNode(index) {
        activeTimelineIndex = index;
        const allWrappers = timelineScroll.querySelectorAll('.timeline-node-wrapper');
        allWrappers.forEach((w, i) => {
            if (i === index) {
                w.classList.add('active-node');
            } else {
                w.classList.remove('active-node');
            }
        });
        updateDetailCard(index);
    }

    function updateDetailCard(index) {
        const data = timelineData[index];
        const detailEmoji = timelineDetail.querySelector('.detail-emoji');
        const detailTitle = timelineDetail.querySelector('.detail-title');
        const detailDesc = timelineDetail.querySelector('.detail-desc');
        const detailDate = timelineDetail.querySelector('.detail-date');

        detailEmoji.style.animation = 'none';
        detailEmoji.offsetHeight;
        detailEmoji.style.animation = 'detailEmojiPop 0.5s ease';
        detailEmoji.textContent = '回忆';
        detailTitle.textContent = data.title;
        detailDesc.textContent = data.desc;
        detailDate.textContent = data.date;
    }

    function scrollToNode(index) {
        const target = timelineScroll.querySelectorAll('.timeline-node-wrapper')[index];
        if (target) {
            const containerWidth = timelineScroll.clientWidth;
            const targetLeft = target.offsetLeft;
            const targetWidth = target.offsetWidth;
            const scrollTo = targetLeft - containerWidth / 2 + targetWidth / 2;
            timelineScroll.scrollTo({
                left: Math.max(0, scrollTo),
                behavior: 'smooth',
            });
        }
    }

    function navigateTimeline(direction) {
        const newIndex = findNextEnabledIndex(activeTimelineIndex, direction);
        if (newIndex !== -1) {
            setActiveTimelineNode(newIndex);
            scrollToNode(newIndex);
        }
    }

    function initTimeline() {
        buildTimelineNodes();
        const firstEnabledIndex = findFirstEnabledIndex();
        if (firstEnabledIndex !== -1) {
            setActiveTimelineNode(firstEnabledIndex);
            setTimeout(() => scrollToNode(firstEnabledIndex), 300);
        }
    }

    btnPrev.addEventListener('click', () => navigateTimeline(-1));
    btnNext.addEventListener('click', () => navigateTimeline(1));

    const dragState = {
        active: false,
        pointerId: null,
        startX: 0,
        startScrollLeft: 0,
        latestScrollLeft: 0,
        rafId: 0,
    };

    function scheduleScrollUpdate() {
        if (dragState.rafId) return;
        dragState.rafId = requestAnimationFrame(() => {
            timelineScroll.scrollLeft = dragState.latestScrollLeft;
            dragState.rafId = 0;
        });
    }

    timelineScroll.addEventListener('pointerdown', function(e) {
        if (e.target.closest('.timeline-node-wrapper')) {
            return;
        }
        dragState.active = true;
        dragState.pointerId = e.pointerId;
        dragState.startX = e.clientX;
        dragState.startScrollLeft = timelineScroll.scrollLeft;
        dragState.latestScrollLeft = timelineScroll.scrollLeft;
        timelineScroll.classList.add('dragging');
        timelineScroll.setPointerCapture(e.pointerId);
        timelineScroll.style.scrollBehavior = 'auto';
    });

    timelineScroll.addEventListener('pointermove', function(e) {
        if (!dragState.active || e.pointerId !== dragState.pointerId) return;
        const delta = e.clientX - dragState.startX;
        dragState.latestScrollLeft = dragState.startScrollLeft - delta * 1.2;
        scheduleScrollUpdate();
    });

    function endTimelineDrag(e) {
        if (!dragState.active || e.pointerId !== dragState.pointerId) return;
        dragState.active = false;
        dragState.pointerId = null;
        timelineScroll.classList.remove('dragging');
        timelineScroll.style.scrollBehavior = '';
        if (dragState.rafId) {
            cancelAnimationFrame(dragState.rafId);
            dragState.rafId = 0;
        }
    }

    timelineScroll.addEventListener('pointerup', endTimelineDrag);
    timelineScroll.addEventListener('pointercancel', endTimelineDrag);

    function init() {
        startHeartRain();
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.7;
                spawnSparkle(x, y);
            }, i * 200);
        }
    }

    init();

    console.log('💝 生日快乐！这个网页是为你精心准备的~');
    console.log('💡 提示：点击蛋糕、爱心、按钮来探索每一页');
    console.log('📅 在时间轴页面可以点击月份节点、使用箭头导航或开启自动播放');
    console.log('🔧 修改回忆内容：在JS代码中找到 timelineData 数组即可自定义');
    console.log('💌 愿你们的每一天都充满爱意 ✨');
})();
