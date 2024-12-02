let videoBox = document.querySelector('.videoBox'),
    video = document.querySelector('.video'),
    control = document.querySelector('.control'),
    prev = document.querySelector('.prev'),
    play = document.querySelector('.play'),
    next = document.querySelector('.next'),
    videoProgress = document.querySelector('.videoProgress'),
    videoBar = document.querySelector('.videoBar'),
    time = document.querySelector('.time'),
    volumeBox = document.querySelector('.volumeBox'),
    volumeBarBox = document.querySelector('.volumeBarBox'),
    volumeValue = document.querySelector('.volumeValue'),
    volumeProgress = document.querySelector('.volumeProgress'),
    volumeBar = document.querySelector('.volumeBar'),
    volume = document.querySelector('.volume'),
    speedBox = document.querySelector('.speedBox'),
    btnBox = document.querySelector('.btnBox'),
    btns = btnBox.getElementsByTagName('div'),
    speed = document.querySelector('.speed'),
    fullScreen = document.querySelector('.fullScreen'),
    videoList = document.querySelector('.videoList'),
    videoListBox = document.querySelector('.videoListBox'),
    caption = document.querySelector('.caption'),
    off = document.querySelector('.off'),
    listBox = document.querySelector('.listBox');

let defaultEpisodes = localStorage.getItem('defaultEpisodes'),
    clickCount = 0,
    eventTimer = null,
    mouseTimer = null,
    isDragging = false,
    defaultVolume = localStorage.getItem('defaultVolume'),
    defaultSpeed = localStorage.getItem('defaultSpeed');

let videoName = '死疫',
    episodes = [
                    {"id": 1, "title": "1、引子", "src": "video/1、引子.mp4"},
                    {"id": 2, "title": "2、前奏", "src": "video/2、前奏.mp4"},
                    {"id": 3, "title": "3、爆发", "src": "video/3、爆发.mp4"},
                    {"id": 4, "title": "4、边缘", "src": "video/4、边缘.mp4"},
                    {"id": 5, "title": "5、失控", "src": "video/5、失控.mp4"},
                    {"id": 6, "title": "6、击杀", "src": "video/6、击杀.mp4"},
                    {"id": 7, "title": "7、潜入", "src": "video/7、潜入.mp4"},
                    {"id": 8, "title": "8、讨要", "src": "video/8、讨要.mp4"},
                    {"id": 9, "title": "9、出路", "src": "video/9、出路.mp4"},
                    {"id": 10, "title": "10、潜行", "src": "video/10、潜行.mp4"},
                    {"id": 11, "title": "11、加入", "src": "video/11、加入.mp4"},
                    {"id": 12, "title": "12、出逃", "src": "video/12、出逃.mp4"},
                    {"id": 13, "title": "13、计划", "src": "video/13、计划.mp4"},
                    {"id": 14, "title": "14、绝境", "src": "video/14、绝境.mp4"}
               ];


video.onloadedmetadata = function()
{
    let totalTime = formatTime(video.duration);
    time.textContent = `00:00:00 / ${totalTime}`;
}
video.ontimeupdate = function()
{
    let playTime = video.currentTime,
        totalTime = video.duration,
        percentage = (playTime / totalTime) * 100;

    localStorage.setItem('defaultPlayTime', playTime);
    videoBar.style.width = `${percentage}%`;

    playTime = formatTime(playTime),
    totalTime = !isNaN(totalTime) ? formatTime(totalTime) : '00:00:00';
    time.textContent = `${playTime} / ${totalTime}`;
}
video.onended = function()
{
    next.click();
}
if(!defaultEpisodes)
{
    localStorage.setItem('defaultEpisodes', '0');
    showEpisodes();
}
else
{
    showEpisodes();
}

function formatTime(time)
{
    let m = Math.floor(time / 60),
        h = Math.floor(m / 60),
        s = Math.floor(time % 60);
    m = m % 60;

    h = h < 10 ? `0${h}` : h;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;

    return `${h}:${m}:${s}`;
}
function showEpisodes()
{
    let defaultEpisodes = localStorage.getItem('defaultEpisodes'),
        defaultPlayTime = localStorage.getItem('defaultPlayTime');
    video.src = episodes[defaultEpisodes].src;
    video.currentTime = defaultPlayTime !== null ? parseFloat(defaultPlayTime) : 0;

    updateVideoListStyle();
}


video.onclick = function()
{
    clickCount++;
    if(clickCount === 1)
    {
        eventTimer = setTimeout(()=>{playVideo(); clickCount = 0;}, 300);
    }
    else if(clickCount === 2)
    {
        clearTimeout(eventTimer);
        toggleFullScreen();
        clickCount = 0;
    }
}
video.oncontextmenu = function()
{
    return false;
}
video.onmousemove = function()
{
    clearTimeout(mouseTimer);
    if(video.paused || video.ended)
    {
        video.style.cursor = 'pointer';
        control.style.bottom = '0';
    }
    else
    {
        video.style.cursor = 'pointer';
        control.style.bottom = '0';
        mouseTimer = setTimeout(()=>{video.style.cursor = 'none'; control.style.bottom = '-40px';}, 2000);
    }
}
play.onclick = function()
{
    playVideo();
}
prev.onclick = function()
{
    let defaultEpisodes = localStorage.getItem('defaultEpisodes');
    defaultEpisodes = (parseInt(defaultEpisodes) - 1 + episodes.length) % episodes.length;
    localStorage.setItem('defaultEpisodes', defaultEpisodes);
    localStorage.setItem('defaultPlayTime', '0');
    showEpisodes();
    playVideo();
}
next.onclick = function()
{
    let defaultEpisodes = localStorage.getItem('defaultEpisodes');
    defaultEpisodes = (parseInt(defaultEpisodes) + 1) % episodes.length;
    localStorage.setItem('defaultEpisodes', defaultEpisodes);
    localStorage.setItem('defaultPlayTime', '0');
    showEpisodes();
    playVideo();
}

function playVideo()
{
    if(video.paused || video.ended)
    {
        let defaultSpeed = localStorage.getItem('defaultSpeed');
        video.playbackRate = parseFloat(defaultSpeed);
        video.play();
        video.style.cursor = 'none';
        control.style.bottom = '-40px';
        play.className = 'pause';
    }
    else
    {
        video.pause();
        clearTimeout(mouseTimer);
        video.style.cursor = 'pointer';
        control.style.bottom = '0';
        play.className = 'play';
    }
}               


videoProgress.onmousedown = function(e)
{
    isDragging = true;
    updateVideoBar(e);
    document.onmousemove = function(e)
    {
        if(isDragging) updateVideoBar(e);
    }

    document.onmouseup = function()
    {
        isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
    }
}
function updateVideoBar(e)
{
    let clickPosition = e.clientX - videoProgress.getBoundingClientRect().left,
        percentage = (clickPosition / videoProgress.clientWidth) * 100;
    percentage = Math.min(100, Math.max(0, percentage));

    videoBar.style.width = `${percentage}%`;


    // 更新视频播放进度
    video.currentTime = (percentage / 100) * video.duration;
}


volumeProgress.onmousedown = function(e)
{
    isDragging = true;
    updateVolumeBar(e);
    document.onmousemove = function(e)
    {
        if(isDragging) updateVolumeBar(e);
    }

    document.onmouseup = function()
    {
        isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
    }
}
function updateVolumeBar(e)
{
    let clickPosition = volumeProgress.getBoundingClientRect().bottom - e.clientY,
        percentage = (clickPosition / volumeProgress.clientHeight) * 100;
    percentage = Math.min(100, Math.max(0, percentage));

    volumeValue.textContent = Math.round(percentage);
    volumeBar.style.height = `${percentage}%`;


    // 更新本地存储 defaultVolume
    let defaultVolume = volumeValue.textContent;
    updateVolume(defaultVolume);
    localStorage.setItem('defaultVolume', defaultVolume);
    localStorage.removeItem('defaultMute');
}

volumeBox.onmouseenter = showVolume;
volumeBox.onmouseleave = hideVolume;
volume.onclick = function()
{
    let defaultVolume = localStorage.getItem('defaultVolume');
    if(volumeValue.textContent === '0' && defaultVolume === '0')
    {
        let defaultVolume = '14';
        updateVolume(defaultVolume);
        localStorage.setItem('defaultVolume', defaultVolume);
        localStorage.removeItem('defaultMute');
    }
    else if(volumeValue.textContent === '0')
    {
        updateVolume(defaultVolume);
        localStorage.removeItem('defaultMute');
    }
    else if(parseInt(volumeValue.textContent) > 0)
    {
        updateVolume('0');
        localStorage.setItem('defaultMute', 'true');
    }
}
if(!defaultVolume)
{
    let defaultVolume = '50';
    updateVolume(defaultVolume);
    localStorage.setItem('defaultVolume', defaultVolume);
}
else
{
    let defaultMute = localStorage.getItem('defaultMute');
    defaultMute === 'true' ? updateVolume('0') : updateVolume(defaultVolume);
}

function showVolume()
{
    volumeBarBox.style.display = 'block';
}
function hideVolume()
{
    volumeBarBox.style.display = 'none';
}
function updateVolume(defaultVolume)
{
    video.muted = defaultVolume === '0' ? true : false;
    video.volume = parseInt(defaultVolume) / 100;
    volumeValue.textContent = defaultVolume;
    volumeBar.style.height = `${defaultVolume}%`;
    volume.className = defaultVolume === '0' ? 'mute' : 'volume';
}


speedBox.onmouseleave = clearBlock;
speed.onclick = function()
{
    btnBox.classList.toggle('block');
}
for(let i = 0; i < btns.length; i++)
{
    btns[i].onclick = function()
    {
        let defaultSpeed = btns[i].textContent;
        updateSpeed(defaultSpeed);
        localStorage.setItem('defaultSpeed', defaultSpeed);
        clearBlock();
    }
}
if(!defaultSpeed)
{
    let defaultSpeed = '1.0x';
    updateSpeed(defaultSpeed);
    localStorage.setItem('defaultSpeed', defaultSpeed);
}
else
{
    updateSpeed(defaultSpeed);
}

function updateSpeed(defaultSpeed)
{
    video.playbackRate = parseFloat(defaultSpeed);
    for(let i = 0; i < btns.length; i++)
    {
        btns[i].style.color = btns[i].textContent === defaultSpeed ? '#ff6f66' : 'white';
    }
    speed.textContent = defaultSpeed === '1.0x' ? '倍速' : defaultSpeed;
}
function clearBlock()
{
    btnBox.classList.remove('block');
}


fullScreen.onclick = toggleFullScreen;
document.onwebkitfullscreenchange = active;

function toggleFullScreen()
{
    if(!document.webkitFullscreenElement)
    {
        document.querySelector('body').webkitRequestFullscreen();
    }
    else if(document.webkitExitFullscreen)
    {
        document.webkitExitFullscreen();
    }
}
function active()
{
    if(document.webkitFullscreenElement)
    {
        document.querySelector('html').style.backgroundColor = '#efeeee';
        videoBox.style.width = '100%';
        videoBox.style.height = '100vh';
        videoBox.style.borderRadius = '0';
        videoProgress.style.width = '65%';
        fullScreen.className = 'quit';
        videoListBox.style.height = '96.5%';
    }
    else
    {
        videoBox.style.width = '1200px';
        videoBox.style.height = '675px';
        videoBox.style.borderRadius = '15px';
        videoProgress.style.width = '45%';
        fullScreen.className = 'fullScreen';
        videoListBox.style.height = '94%';
    }
}


videoList.onclick = function()
{
    videoListBox.classList.toggle('right');
}
videoListBox.onmouseleave = clearRight;
off.onclick = function()
{
    clearRight();
}
listBox.onclick = function(e)
{
    let defaultEpisodes = localStorage.getItem('defaultEpisodes');
    if(e.target.className !== 'listBox' && e.target.nodeName.toLowerCase() === 'div' && e.target.getAttribute('unique') !== defaultEpisodes)
    {
        let defaultEpisodes = e.target.getAttribute('unique');
        localStorage.setItem('defaultEpisodes', defaultEpisodes);
        localStorage.setItem('defaultPlayTime', '0');
        showEpisodes();
        playVideo();
        clearRight();
    }
}

function clearRight()
{
    videoListBox.classList.remove('right');
}
function showVideoList()
{
    caption.textContent = videoName;
    for(let i = 0; i < episodes.length; i++)
    {
        let div = document.createElement('div');
            div.textContent = episodes[i].title;
            div.setAttribute('unique', i);
        listBox.appendChild(div);
    }

    updateVideoListStyle();
}
showVideoList();
function updateVideoListStyle()
{
    let defaultEpisodes = localStorage.getItem('defaultEpisodes'),
        divs = document.querySelectorAll('.listBox div');
    for(let i = 0; i < divs.length; i++)
    {
        divs[i].style.color = divs[i].getAttribute('unique') === defaultEpisodes ? '#ff6f66' : 'white';
    }
}


document.onkeydown = function(e)
{
    let defaultVolume = localStorage.getItem('defaultVolume');
    if(e.code === 'Space')
    {
        playVideo();
    }
    else if(e.code === 'ArrowLeft')
    {
        video.currentTime -= 10;
    }
    else if(e.code === 'ArrowRight')
    {
        video.currentTime += 10;
    }
    else if(e.code === 'ArrowUp')
    {
        showVolume();
        parseInt(defaultVolume++);
        defaultVolume = Math.min(100, Math.max(0, defaultVolume));
        updateVolume(String(defaultVolume));
        localStorage.setItem('defaultVolume', defaultVolume);
        localStorage.removeItem('defaultMute');
    }
    else if(e.code === 'ArrowDown')
    {
        showVolume();
        parseInt(defaultVolume--);
        defaultVolume = Math.min(100, Math.max(0, defaultVolume));
        updateVolume(String(defaultVolume));
        localStorage.setItem('defaultVolume', defaultVolume);
        localStorage.removeItem('defaultMute');
    }
    else if(e.code === 'F11')
    {
        e.preventDefault();
        toggleFullScreen();
    }
    clearTimeout(eventTimer);
    eventTimer = setTimeout(()=>{hideVolume()}, 2000);
}