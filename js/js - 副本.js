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

// 获取默认集索引
let defaultEpisodes = localStorage.getItem('defaultEpisodes'),
// 初始化模拟双击事件
    clickCount = 0,
// 事件定时器
    eventTimer = null,
// 鼠标事件定时器
    mouseTimer = null,
// 初始化按下鼠标移动事件
    isDragging = false,
// 获取默认音量
    defaultVolume = localStorage.getItem('defaultVolume'),
// 获取默认倍速
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


// 视频有视频链接时加载总时间
video.onloadedmetadata = function()
{
    let totalTime = formatTime(video.duration);
    time.textContent = `00:00:00 / ${totalTime}`;
}
// 视频播放时事件
video.ontimeupdate = function()
{
    // 播放时间
    let playTime = video.currentTime,
    // 总时间
        totalTime = video.duration,
    // 播放时间 除以 总时间 乘以 100 得到百分比
        percentage = (playTime / totalTime) * 100;

    // 存储播放时间
    localStorage.setItem('defaultPlayTime', playTime);
    // 更新视频进度条
    videoBar.style.width = `${percentage}%`;

    // 格式化播放时间，如：00:00:00
    playTime = formatTime(playTime),
    // 格式化总时间，三元运算符判断 总时间 是否为NaN如果不是NaN则格式化总时间、是NaN则输出00:00:00
    totalTime = !isNaN(totalTime) ? formatTime(totalTime) : '00:00:00';
    // 输出播放时间和总时间
    time.textContent = `${playTime} / ${totalTime}`;
}
// 视频播放完毕播放下一个视频
video.onended = function()
{
    next.click();
}
// 判断页面是否有默认集，如果没有则初始化默认集为第一集
if(!defaultEpisodes)
{
    localStorage.setItem('defaultEpisodes', '0');
    showEpisodes();
}
else
{
    // 有默认集则直接显示视频
    showEpisodes();
}

// 格式化视频时间函数，视频时间一般为 浮点型 所以要格式化为：00:00:00
function formatTime(time)
{
    // 先把 m 分钟格式化给 h，看看是不是有几小时的视频
    let m = Math.floor(time / 60),
    // 格式化小时
        h = Math.floor(m / 60),
    // 格式化秒
        s = Math.floor(time % 60);
    // 格式化分
    m = m % 60;

    // 判断是否小于10，如果小于10则在前面加 0
    h = h < 10 ? `0${h}` : h;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;

    // 返回格式化时间
    return `${h}:${m}:${s}`;
}
// 显示集函数
function showEpisodes()
{
    // 获取默认集索引
    let defaultEpisodes = localStorage.getItem('defaultEpisodes'),
    // 获取播放时间
        defaultPlayTime = localStorage.getItem('defaultPlayTime');
    // 把默认集的索引带出episodes数组链接并赋值给video.src
    video.src = episodes[defaultEpisodes].src;
    // 把播放时间赋值给video.currentTime
    video.currentTime = defaultPlayTime !== null ? parseFloat(defaultPlayTime) : 0;

    // 更新集数列表按钮样式
    updateVideoListStyle();
}


// 点击、双击video标签播放或全屏
video.onclick = function()
{
    clickCount++;
    // 判断 模拟双击事件的变量 是否为1，为1则播放视频
    if(clickCount === 1)
    {
        eventTimer = setTimeout(()=>{playVideo(); clickCount = 0;}, 300);
    }
    // 判断 模拟双击事件的变量 是否为2，为2则全屏
    else if(clickCount === 2)
    {
        clearTimeout(eventTimer);
        // 全屏函数
        toggleFullScreen();
        clickCount = 0;
    }
}
// video标签禁止右键菜单
video.oncontextmenu = function()
{
    return false;
}
// video标签鼠标移动事件
video.onmousemove = function()
{
    clearTimeout(mouseTimer);
    // 暂停视频鼠标移动则显示播放控制模块
    if(video.paused || video.ended)
    {
        video.style.cursor = 'pointer';
        control.style.bottom = '0';
    }
    else
    {
        // 播放视频鼠标移动则显示播放控制模块
        video.style.cursor = 'pointer';
        control.style.bottom = '0';
        // 播放视频鼠标不移动则隐藏播放控制模块
        mouseTimer = setTimeout(()=>{video.style.cursor = 'none'; control.style.bottom = '-40px';}, 2000);
    }
}
// 播放按钮点击播放视频
play.onclick = function()
{
    playVideo();
}
// 上一集按钮
prev.onclick = function()
{
    // 获取默认集索引
    let defaultEpisodes = localStorage.getItem('defaultEpisodes');
    // 计算上一集 如：共有14集它的索引是0到13，当前播放视频是第二集视频索引为1，计算上一集视频索引为0
    defaultEpisodes = (parseInt(defaultEpisodes) - 1 + episodes.length) % episodes.length;
    // 存储更新集索引
    localStorage.setItem('defaultEpisodes', defaultEpisodes);
    // 重置播放时间
    localStorage.setItem('defaultPlayTime', '0');
    // 显示集
    showEpisodes();
    // 播放视频
    playVideo();
}
// 下一集按钮
next.onclick = function()
{
    let defaultEpisodes = localStorage.getItem('defaultEpisodes');
    // 计算下一集 如：共有14集它的索引是0到13，当前播放视频是第二集视频索引为1，计算下一集视频索引为2
    defaultEpisodes = (parseInt(defaultEpisodes) + 1) % episodes.length;
    localStorage.setItem('defaultEpisodes', defaultEpisodes);
    localStorage.setItem('defaultPlayTime', '0');
    showEpisodes();
    playVideo();
}

// 播放函数
function playVideo()
{
    // 视频暂停时
    if(video.paused || video.ended)
    {
        // 获取倍速
        let defaultSpeed = localStorage.getItem('defaultSpeed');
        // 给视频设置倍速
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


// 视频进度条，鼠标按下时
videoProgress.onmousedown = function(e)
{
    // 更新按下鼠标移动事件
    isDragging = true;
    // 更新进度条
    updateVideoBar(e);
    // 鼠标移动事件
    document.onmousemove = function(e)
    {
        // 鼠标在按下移动时更新进度条
        if(isDragging) updateVideoBar(e);
    }

    // 鼠标弹起时
    document.onmouseup = function()
    {
        isDragging = false;
        // 取消鼠标移动和弹起事件
        document.onmousemove = null;
        document.onmouseup = null;
    }
}
// 更新进度条函数
function updateVideoBar(e)
{
    // 鼠标按下时进度条宽度从左向右
    let clickPosition = e.clientX - videoProgress.getBoundingClientRect().left,
    // 获取进度条百分比
        percentage = (clickPosition / videoProgress.clientWidth) * 100;
    // 限制百分比大小为：最小为0、最大为100
    percentage = Math.min(100, Math.max(0, percentage));

    // 更新进度条
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

// 鼠标经过音量按钮父元素时显示进度条
volumeBox.onmouseenter = showVolume;
// 鼠标离开音量按钮父元素或父元素的子元素时隐藏进度条
volumeBox.onmouseleave = hideVolume;
// 音量按钮点击事件
volume.onclick = function()
{
    // 获取默认音量
    let defaultVolume = localStorage.getItem('defaultVolume');
    // 如果页面元素的音量值等于0 逻辑与 默认音量也等于0则重置音量为14音量值，并取消静音状态
    if(volumeValue.textContent === '0' && defaultVolume === '0')
    {
        let defaultVolume = '14';
        updateVolume(defaultVolume);
        localStorage.setItem('defaultVolume', defaultVolume);
        localStorage.removeItem('defaultMute');
    }
    // 如果页面元素的音量值等于0则显示默认音量，并取消静音状态
    else if(volumeValue.textContent === '0')
    {
        updateVolume(defaultVolume);
        localStorage.removeItem('defaultMute');
    }
    // 如果页面元素的音量值大于0则显示音量为0，并开启静音状态
    else if(parseInt(volumeValue.textContent) > 0)
    {
        updateVolume('0');
        localStorage.setItem('defaultMute', 'true');
    }
}
// 没有默认音量则初始化音量为50
if(!defaultVolume)
{
    let defaultVolume = '50';
    updateVolume(defaultVolume);
    localStorage.setItem('defaultVolume', defaultVolume);
}
// 有默认音量则判断是否有静音状态，如果有则显示0、没有就显示默认音量
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
// 音量函数
function updateVolume(defaultVolume)
{
    // 判断默认音量是否为0，为0则静音、不为0则不静音。true静音、false不静音
    video.muted = defaultVolume === '0' ? true : false;
    // 设置音量
    video.volume = parseInt(defaultVolume) / 100;
    // 设置显示音量值
    volumeValue.textContent = defaultVolume;
    // 设置音量进度条
    volumeBar.style.height = `${defaultVolume}%`;
    // 设置音量静音、不静音状态样式
    volume.className = defaultVolume === '0' ? 'mute' : 'volume';
}


// 鼠标离开倍速父元素则隐藏倍速按钮
speedBox.onmouseleave = clearBlock;
speed.onclick = function()
{
    btnBox.classList.toggle('block');
}
// 倍速按钮点击设置视频倍速
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

// 更新倍速按钮样式函数
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


// 点击全屏按钮设置全屏
fullScreen.onclick = toggleFullScreen;
document.onwebkitfullscreenchange = active;

function toggleFullScreen()
{
    // 不是全屏状态点击则全屏
    if(!document.webkitFullscreenElement)
    {
        document.querySelector('body').webkitRequestFullscreen();
    }
    // 是全屏状态点击则退出全屏
    else if(document.webkitExitFullscreen)
    {
        document.webkitExitFullscreen();
    }
}
// 全屏、非全屏时自定义video所有元素样式改变
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
// 集数按钮事件
listBox.onclick = function(e)
{
    let defaultEpisodes = localStorage.getItem('defaultEpisodes');
    // 排除父元素被点击、是否是子元素被点击、必须不是相同的unique等于默认集索引
    if(e.target.className !== 'listBox' && e.target.nodeName.toLowerCase() === 'div' && e.target.getAttribute('unique') !== defaultEpisodes)
    {
        // 获取按钮上自定义属性的集数索引
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
// 显示集数按钮函数
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
// 更新集数按钮样式
function updateVideoListStyle()
{
    let defaultEpisodes = localStorage.getItem('defaultEpisodes'),
        divs = document.querySelectorAll('.listBox div');
    for(let i = 0; i < divs.length; i++)
    {
        divs[i].style.color = divs[i].getAttribute('unique') === defaultEpisodes ? '#ff6f66' : 'white';
    }
}


// 键盘快捷事件
document.onkeydown = function(e)
{
    let defaultVolume = localStorage.getItem('defaultVolume');
    // 空格播放视频
    if(e.code === 'Space')
    {
        playVideo();
    }
    // 视频快退
    else if(e.code === 'ArrowLeft')
    {
        video.currentTime -= 10;
    }
    // 视频快进
    else if(e.code === 'ArrowRight')
    {
        video.currentTime += 10;
    }
    // 视频音量加
    else if(e.code === 'ArrowUp')
    {
        showVolume();
        parseInt(defaultVolume++);
        defaultVolume = Math.min(100, Math.max(0, defaultVolume));
        updateVolume(String(defaultVolume));
        localStorage.setItem('defaultVolume', defaultVolume);
        localStorage.removeItem('defaultMute');
    }
    // 视频音量减
    else if(e.code === 'ArrowDown')
    {
        showVolume();
        parseInt(defaultVolume--);
        defaultVolume = Math.min(100, Math.max(0, defaultVolume));
        updateVolume(String(defaultVolume));
        localStorage.setItem('defaultVolume', defaultVolume);
        localStorage.removeItem('defaultMute');
    }
    // 视频全屏
    else if(e.code === 'F11')
    {
        e.preventDefault();
        toggleFullScreen();
    }
    // 音量进度条隐藏
    clearTimeout(eventTimer);
    eventTimer = setTimeout(()=>{hideVolume()}, 2000);
}