/* ==========================================================================
   app.js — page nav, lightbox, lazy fetches, dark mode, scroll progress
   ========================================================================== */
(function () {
    'use strict';

    // ----- i18n -----------------------------------------------------------
    const I18N_KEY = 'cgd-lang';
    let currentLang = 'en';
    let papersCache = null;
    let patentsCache = null;
    let reviewersCache = null;

    const translations = {
        en: {
            'meta.title': 'Guangda Chen — Head of Robotics Algorithms | Robotics, Embodied AI',
            'meta.description': 'Dr. Guangda Chen — Head of Robotics Algorithms at NetEase Fuxi Robotics, Ph.D. from USTC. Research on autonomous heavy machinery, deep reinforcement learning navigation, and embodied AI.',

            'nav.home': 'Home',
            'nav.about': 'About Me',
            'nav.projects': 'Projects',
            'nav.publications': 'Publications',
            'nav.menu_toggle': 'Toggle menu',
            'nav.theme_dark': 'Switch to dark mode',
            'nav.theme_light': 'Switch to light mode',
            'nav.lang_toggle': 'Switch to Chinese',
            'back_to_top': 'Back to top',

            'header.name': 'Guangda Chen',

            'home.tagline': 'Robotics · Automation · Embodied AI',
            'home.card_about_title': 'About Me',
            'home.card_about_body': 'Dr. Guangda Chen currently serves as Head of Robotics Algorithms at Fuxi Robotics in NetEase. He holds a Ph.D. degree in Computer Science from the USTC (2021).',
            'home.card_projects_title': 'Projects',
            'home.card_projects_body': 'Research and development projects spanning heavy machine automation, deep reinforcement learning-based navigation and service robotics.',
            'home.card_publications_title': 'Publications',
            'home.card_publications_body': 'Academic publications, <a href="#talks" class="nav-link" style="color: var(--ink-blue); text-decoration: none;">conference presentations</a>, and granted patents in robotics, artificial intelligence, and autonomous systems.',
            'home.btn_learn_more': 'Learn more',
            'home.btn_view_projects': 'View projects',
            'home.btn_view_publications': 'View publications',
            'home.contact_title': 'Contact Information',
            'home.contact_email': 'Email:',
            'home.contact_address': 'Address:',
            'home.address_value': 'NetEase, 399 Wangshang Road, Binjiang District, Hangzhou, China',

            'about.biography': 'Biography',
            'about.contact_email': 'Email:',
            'about.biography_body': 'Dr. Guangda Chen is currently working as Head of Robotics Algorithms at <a href="https://fuxi.163.com/" class="bluelink">Fuxi Robotics in NetEase</a>. He received his Ph.D. degree in Computer Science from <a href="https://www.ustc.edu.cn/" class="bluelink">University of Science and Technology of China</a> in 2021 (BA17011, advised by Prof. <a href="https://cs.ustc.edu.cn/2020/0828/c23235a460075/pagem.htm" class="bluelink">Xiaoping Chen</a> in the <a href="http://ai.ustc.edu.cn/" class="bluelink">USTC Robotics Laboratory</a>). Before joining USTC Robotics Lab in 2015, he received a Bachelor of Administration from <a href="http://www.cmu.edu.cn/" class="bluelink">China Medical University</a> in 2014. As a graduate student, he focused on researching mobile robot navigation in dynamic and crowded environments. Currently, he is dedicated to developing and applying innovative automation and intelligent technologies in heavy construction machinery.',
            'about.find_him_on': 'Find him on:',
            'about.employment': 'Employment',
            'about.education': 'Education',
            'about.emp.netease_dates': '2021 — Present',
            'about.emp.netease_role': 'Algorithm Lead',
            'about.emp.netease_org': 'NetEase, Inc.',
            'about.emp.netease_sub': 'Fuxi Robotics',
            'about.emp.zju_dates': '2023 — 2025',
            'about.emp.zju_role': 'Postdoctoral Researcher',
            'about.emp.zju_org_html': '<strong><a href="https://www.zju.edu.cn/">Zhejiang University</a></strong> [Prof. <a href="https://person.zju.edu.cn/0097062">Rong Xiong</a>]',
            'about.emp.zju_sub': 'College of Control Science and Engineering',
            'about.edu.phd_dates': '2015 — 2021',
            'about.edu.phd_role': 'Ph.D. in Computer Science',
            'about.edu.phd_org_html': '<strong><a href="https://www.ustc.edu.cn/">University of Science and Technology of China</a></strong> [Prof. <a href="https://cs.ustc.edu.cn/2020/0828/c23235a460075/pagem.htm">Xiaoping Chen</a>]',
            'about.edu.phd_sub': 'School of Computer Science and Technology',
            'about.edu.ba_dates': '2011 — 2014',
            'about.edu.ba_role': 'Bachelor of Administration',
            'about.edu.ba_org': 'China Medical University',
            'about.edu.ba_sub': 'Medical Informatics',
            'about.edu.stom_dates': '2010 — 2011',
            'about.edu.stom_role': 'Stomatology',
            'about.edu.stom_org': 'China Medical University',
            'about.edu.stom_sub': 'Stomatology',

            'projects.loader_title': 'Unmanned Loader (2023 - Present)',
            'projects.loader_body': 'Unmanned loader system for intelligent material handling in industrial sites like <a href="https://mp.weixin.qq.com/s/9C-TNqmk_DaHqbVDnatrDA"> batching plants, power facilities, chemical complexes and ports</a>.<br><ul><li>High-Precision Hydraulic & Propulsion Control (<a href="https://mp.weixin.qq.com/s/KPr6EH8wozEnLDP1e_gi4A">Diesel</a> / <a href="https://mp.weixin.qq.com/s/5x0-5_HSsuYDVoltJ6N4mA">Electric</a>)</li><li>Autonomous Mobility & Navigation</li><li><a href="https://doi.org/10.1016/j.engappai.2026.113908">Efficient and Robust Shoveling Control System</a> <a href="pdf/1-s2.0-S0952197626001892-main.pdf">[Paper]</a></li><li>Industry\'s First Embodied AI-based Autonomous Stacking</li><li><a href="https://lingdong.fuxi.163.com/productSummary/cabin_cleaner">Multi-Terminal Remote Control & Assistance System</a></li></ul>',
            'projects.excavator_title': 'Excavator Robot (2021 - 2023, 2026 - Present)',
            'projects.excavator_body': 'An autonomous planning and control system for excavators in human-robot collaborative applications. Details: <a href="https://lingdong.fuxi.163.com/productSummary/wj?lang=en">Official Website</a> | <a href="pdf/Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation.pdf">Paper</a> | <a href="https://youtu.be/N6I0WZGSF68">Demo</a><ul><li>Hydraulic Actuation Control</li><li>Autonomous Digging</li><li>Autonomous Navigation</li><li>Game-Inspired Teleoperation</li></ul>',
            'projects.drl_title': 'DRL-based Navigation (2019 - 2021)',
            'projects.drl_body': 'Group Leader, <a href="https://github.com/DRL-Navigation" class="bluelink">Open source code on GitHub</a><ul><li><a href="pdf/ICNSC_2020_paper_11.pdf" class="bluelink"> DQN-based Obstacle Avoidance</a>, <a href="https://youtu.be/Eq4AjsFH_cU" class="bluelink">[Demo]</a></li><li><a href="pdf/IROS_2021_DRQNNav.pdf" class="bluelink"> DRQN-based 3D Obstacle Avoidance</a>, <a href="https://youtu.be/cnCid0qOZg4" class="bluelink">[Demo]</a></li><li><a href="pdf/ICTAI_2020.pdf" class="bluelink"> Multi-Robot Collision Avoidance</a>, <a href="https://youtu.be/KOb1q23L7-U" class="bluelink">[Demo]</a></li><li><a href="pdf/IROS_2021_PedNav.pdf" class="bluelink">Crowd Navigation</a>, <a href="https://www.bilibili.com/video/BV1Vb4y1D7R6" class="bluelink">[Demo]</a>, <a href="gitstats/authors.html" class="bluelink" target="_blank"> [Code statistics] </a></li><li><a href="pdf/ICRA2022_BEEP_FINAL_06_03.pdf" class="bluelink">Crowd Navigation with Interaction Capacity</a></li></ul>',
            'projects.panda_title': 'Panda Robot (2020 - 2021)',
            'projects.panda_body': 'Tour guide robot at the <a href="https://www.panda.org.cn/en/education/framework/2023-07-16/7850.html" class="bluelink">Chengdu Giant Panda Museum.</a><br>Group Leader, (<a href="pdf/phd_cgd.pdf#page=112" class="bluelink">PhD thesis</a>, <a href="pdf/phd_cgd.pdf#page=90" class="bluelink">Ch. 4</a> and <a href="pdf/phd_cgd.pdf#page=112" class="bluelink">Ch. 5</a>)<br><ul><li>Pedestrian detection and tracking, <a href="https://www.bilibili.com/video/BV1HB4y1P7xE" class="bluelink">[Demo]</a></li><li>Long-term robust localization, <a href="https://www.bilibili.com/video/BV1q5411w7qX" class="bluelink">[Demo]</a></li><li>Navigation in dense crowds, <a href="https://www.bilibili.com/video/BV13Z4y1A7br" class="bluelink">[Brief Demo]</a>, <a href="https://www.bilibili.com/video/BV1wU4y1V7cA?share_source=copy_web" class="bluelink">[Full Demo]</a></li><li>Tour guide service v1.0, <a href="https://www.bilibili.com/video/BV1UM4y1u7t8" class="bluelink">[Demo]</a></li></ul>',
            'projects.kejia_title': 'Kejia Robot (2015 - 2019)',
            'projects.kejia_intro': 'Team: <a href="http://ai.ustc.edu.cn/en/robocup/atHome">WrightEagle@Home</a><br><a href="pdf/tdp19.pdf" class="bluelink">[TDP <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>, <a href="pdf/poster19_athome.pdf" class="bluelink">[Poster <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>, <a href="pdf/ECRDC_USTC.pdf" class="bluelink">[Report <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>, <a href="https://youtu.be/sWi9EOKIhlE" class="bluelink">[Demo]</a>',
            'projects.kejia_body': '<table border="1" cellpadding="3" cellspacing="0" class="kejia-table"><tr><th>Event</th><th>Location</th><th>Award</th><th>Role</th></tr><tr><td><a href="http://www.rcccaa.org/zdy/gui.html" class="bluelink">RoboCup China Open@Home 2015</a></td><td>Guiyang</td><td>Champion</td><td>Major</td></tr><tr><td><a href="https://www.robocup.org/events/5" class="bluelink">RoboCup@Home 2016</a></td><td>Leipzig</td><td>3rd Place</td><td>Major</td></tr><tr><td><a href="https://www.robocup.org/events/14" class="bluelink">Pre-RoboCup Asia-Pacific 2017</a></td><td>Beijing</td><td>Champion</td><td>Major</td></tr><tr><td><a href="https://www.robocup.org/events/6" class="bluelink">RoboCup@Home 2017</a></td><td>Nagoya</td><td>Best Manipulation</td><td>Major</td></tr><tr><td><a href="https://www.ijcai19.org/competitions.html" class="bluelink">IJCAI-2019 Eldercare Robot Challenges</a></td><td>Macau</td><td>Champion</td><td>Leader</td></tr></table>The team is back, now at <a href="https://wrighteagleai.homes/"><b>WrightEagle.AI</b></a>',
            'projects.mocap_title': 'MoCap System (2016 - 2018)',
            'projects.mocap_body': '<p>for Testing:<br>- <a href="pdf/Cleaning_Robots_Test.pdf" class="bluelink">Cleaning Robots Test</a><br>- <a href="http://roboticsbase.ustc.edu.cn/" class="bluelink">Anhui Robot Technology Standard Innovation Base</a><br>for Calibration:<br>- <a href="http://staff.ustc.edu.cn/~wufeng02/doc/pdf/ZCWicira17.pdf" class="bluelink">General Batch-Calibration Framework</a><br>- <a href="pdf/rgbd_cal_j.pdf" class="bluelink">RGB-D Cameras Calibration</a><br>for Training:<br>- <a href="http://www.sohu.com/a/217691740_100071565" class="bluelink">Real Simulation Unified Platform</a><br></p>',

            'pub.selected_title': 'Selected Publications',
            'pub.all_publications': 'All publications: <a href="https://scholar.google.com/citations?user=h7vRddgAAAAJ&hl=zh-CN">Google Scholar</a>, <a href="https://www.researchgate.net/profile/Guangda_Chen4">ResearchGate</a>.',
            'pub.equal_contrib': '<b>*</b> These authors contributed equally to the work.',
            'pub.loading': 'Loading publications...',
            'pub.no_data': 'No publication data found',
            'pub.load_error': 'Could not load publications: ',

            'patents.title': 'Granted Patents',
            'patents.all_patents': 'All patents: <a href="https://www.patentguru.com/cn/search?inventor=%22%E9%99%88%E5%B9%BF%E5%A4%A7%22&assignee=%22%E7%BD%91%E6%98%93%22,%22%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%22&SortBy=pubdate_newest">PatentGuru</a>.',
            'patents.show_more': 'Show More',
            'patents.show_less': 'Show Less',
            'patents.award_badge': '🏆 NetEase’s Top 10 Patents (2025)',
            'patents.load_error': 'Could not load patents: ',

            'academic.title': 'Academic Service',
            'academic.journal_reviewer': 'Journal Reviewer:',
            'reviewers.load_error': 'Could not load reviewers: ',

            'talks.title': 'Conference Presentations',
            'talks.intro': 'Selected talks and presentations at academic conferences and industry events.',
            'talks.event_photos': 'Event Photos',
            'talks.intl_conf_badge': 'International Conference',

            'talks.csdn.badge': 'CSDN AI Singularity Summit',
            'talks.csdn.title': 'Data-Driven Algorithms: Full-Process Scaled Deployment of Autonomous Loaders',
            'talks.csdn.conference': 'CSDN AI Singularity Summit',
            'talks.csdn.date': 'April 18, 2026 | Global Harbor, Shanghai',
            'talks.csdn.description': 'Facing labor shortages, safety risks, and efficiency bottlenecks in the construction machinery industry, the autonomous transformation of loaders has become a core breakthrough for industrial upgrading. This talk focused on NetEase Lingdong’s scaled deployment in real industrial scenarios such as batching plants, and provided an in-depth analysis of how to build a data-driven technological closed loop that systematically tackles the full operational pipeline of autonomous loaders — from mobile navigation and precise shoveling to intelligent stacking.',
            'talks.csdn.links': 'Official conference page: <a href="https://ml-summit.org/speaker/1258?uid=c1048">Summit Website</a>',

            'talks.top100.badge': 'Top100 Global Software Case Summit',
            'talks.top100.title': 'Breaking Through Loader Automation: A Full-Process Deep Practice of Data-Driven Algorithms',
            'talks.top100.conference': 'Top100 Global Software Case Study Summit',
            'talks.top100.date': 'November 22, 2025 | Zhongguancun, Beijing',
            'talks.top100.description': 'The 14th TOP100 Global Software Case Study Summit, organized by MSUP, concluded successfully in Beijing. Themed "Future-Oriented Organizational Evolution and Innovation Management," the summit brought together more than 100 technology innovators from around the world to discuss paths of organizational transformation under trends such as generative AI and software–hardware integration. During the event, Dr. Chen, Head of Planning and Control Algorithms at NetEase Fuxi, delivered a talk titled "Breaking Through Loader Automation: A Full-Process Deep Practice of Data-Driven Algorithms," systematically sharing the team’s technical exploration and practical experience in autonomous loaders.',
            'talks.top100.links': 'Media coverage: <a href="https://mp.weixin.qq.com/s/kNd0hAy7AWJeOC-iC4ZD2A">NetEase Fuxi WeChat</a><br>Official conference page: <a href="https://www.top100summit.com/detail?aid=4733&id=18661">TOP100 Website</a>',

            'talks.ictai.title': 'Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation',
            'talks.ictai.conference': 'IEEE 35th International Conference on Tools with Artificial Intelligence (ICTAI 2023)',
            'talks.ictai.date': 'November 2023 | Atlanta, GA, USA',
            'talks.ictai.description': 'The paper, "Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation," was presented at the IEEE 35th International Conference on Tools with Artificial Intelligence (ICTAI 2023). The research on human-in-the-loop automation for excavators was shared with the international community via an online presentation.',
            'talks.ictai.links': 'Full Paper (PDF): <a href="pdf/Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation.pdf">paper.pdf</a><br>Demonstration Video: <a href="https://youtu.be/N6I0WZGSF68">YouTube</a>',

            'talks.icnsc.title': 'Robot Navigation with Map-Based Deep Reinforcement Learning',
            'talks.icnsc.conference': 'International Conference on Networking, Sensing, and Control (ICNSC 2020)',
            'talks.icnsc.date': 'October 2020 | Nanjing, China',
            'talks.icnsc.description': 'The paper titled "Robot Navigation with Map-Based Deep Reinforcement Learning" was presented at ICNSC 2020. This research introduced a novel deep reinforcement learning framework for mobile robot navigation that effectively utilizes grid maps. The work was delivered through an oral presentation, highlighting its innovative approach to solving complex navigation tasks. This pioneering study laid the foundation for a series of subsequent research projects in DRL-based navigation within the research group. The significant contribution of this work was recognized with the Best Student Paper Award at the conference.',

            'footer.copyright': '© 2026 Guangda Chen. All rights reserved.',
            'footer.note': 'The materials on this website are provided to facilitate the timely dissemination of scholarly and technical work. Copyright and all rights therein are retained by authors or by other copyright holders. All persons accessing this information are expected to adhere to the terms and constraints invoked by each author’s copyright. In most cases, these works may not be reposted without the explicit permission of the copyright holder.',
            'footer.songjia': 'Song-Jia Yi’s ORCID',
            'footer.maintained': '🤖 Designed & maintained with Claude Code (Anthropic)',
            'footer.maintained_title': 'This site was designed, refactored, and continuously maintained in collaboration with Anthropic’s Claude Code — covering layout, styling, data loading, and accessibility improvements.'
        },
        zh: {
            'meta.title': '陈广大 — 网易灵动技术负责人 | 机器人、具身智能',
            'meta.description': '陈广大博士 — 网易灵动技术负责人，中国科学技术大学博士。研究方向涵盖重型机械自主作业、深度强化学习导航与具身智能。',

            'nav.home': '主页',
            'nav.about': '关于',
            'nav.projects': '项目',
            'nav.publications': '论著',
            'nav.menu_toggle': '切换菜单',
            'nav.theme_dark': '切换至深色模式',
            'nav.theme_light': '切换至浅色模式',
            'nav.lang_toggle': '切换至英文',
            'back_to_top': '返回顶部',

            'header.name': '陈广大',

            'home.tagline': '机器人 · 自动化 · 具身智能',
            'home.card_about_title': '关于我',
            'home.card_about_body': '陈广大博士现任网易灵动技术负责人，2021 年获中国科学技术大学计算机科学博士学位。',
            'home.card_projects_title': '研究项目',
            'home.card_projects_body': '涵盖重型机械自动化、基于深度强化学习的导航以及服务机器人等方向的研究与工程实践。',
            'home.card_publications_title': '论著与专利',
            'home.card_publications_body': '机器人、人工智能与自主系统领域的学术论文、<a href="#talks" class="nav-link" style="color: var(--ink-blue); text-decoration: none;">学术报告</a>以及授权专利。',
            'home.btn_learn_more': '了解更多',
            'home.btn_view_projects': '查看项目',
            'home.btn_view_publications': '查看论著',
            'home.contact_title': '联系方式',
            'home.contact_email': '邮箱：',
            'home.contact_address': '地址：',
            'home.address_value': '中国浙江省杭州市滨江区网商路 399 号 网易园区',

            'about.biography': '个人简介',
            'about.contact_email': '邮箱：',
            'about.biography_body': '陈广大，网易灵动技术负责人。高级工程师，中国科学技术大学计算机博士，浙江大学控制学院博士后。发表学术论文12篇，曾获RoboCup机器人大赛国际季军、IJCAI-2019机器人挑战赛第一名、ICNSC-2020最佳学生论文奖。长期从事机器人具身智能与工程机械无人化研究，聚焦重载机械智能感知、规划控制与自主作业。主导网易灵动工程机械智能化从0到1的研发与落地，申请发明专利50余项（授权18项），获2025网易十佳专利奖，研发的“拌合站无人装载机系统”在国内首次实现全流程真无人作业，人效比超120%，成果入选杭州市人工智能大模型首用优秀解决方案，已成功应用于全国多个大型基建项目，推动工程机械智能化变革。',
            'about.find_him_on': '其他平台：',
            'about.employment': '工作经历',
            'about.education': '教育背景',
            'about.emp.netease_dates': '2021 — 至今',
            'about.emp.netease_role': '算法主管',
            'about.emp.netease_org': '网易公司',
            'about.emp.netease_sub': '伏羲机器人',
            'about.emp.zju_dates': '2023 — 2025',
            'about.emp.zju_role': '博士后研究员',
            'about.emp.zju_org_html': '<strong><a href="https://www.zju.edu.cn/">浙江大学</a></strong>（合作导师：<a href="https://person.zju.edu.cn/0097062">熊蓉教授</a>）',
            'about.emp.zju_sub': '控制科学与工程学院',
            'about.edu.phd_dates': '2015 — 2021',
            'about.edu.phd_role': '计算机应用技术 博士',
            'about.edu.phd_org_html': '<strong><a href="https://www.ustc.edu.cn/">中国科学技术大学</a></strong>（导师：<a href="https://cs.ustc.edu.cn/2020/0828/c23235a460075/pagem.htm">陈小平教授</a>）',
            'about.edu.phd_sub': '计算机科学与技术学院',
            'about.edu.ba_dates': '2011 — 2014',
            'about.edu.ba_role': '管理学 学士',
            'about.edu.ba_org': '中国医科大学',
            'about.edu.ba_sub': '医学信息学',
            'about.edu.stom_dates': '2010 — 2011',
            'about.edu.stom_role': '口腔医学',
            'about.edu.stom_org': '中国医科大学',
            'about.edu.stom_sub': '口腔医学',

            'projects.loader_title': '无人装载机（2023 — 至今）',
            'projects.loader_body': '面向<a href="https://mp.weixin.qq.com/s/9C-TNqmk_DaHqbVDnatrDA">拌合站、电厂、化工园区与港口</a>等工业场景的无人装载机系统，用于物料的智能化搬运作业。<br><ul><li>高精度液压与行驶控制（<a href="https://mp.weixin.qq.com/s/KPr6EH8wozEnLDP1e_gi4A">柴油</a> / <a href="https://mp.weixin.qq.com/s/5x0-5_HSsuYDVoltJ6N4mA">电动</a>）</li><li>自主移动与导航</li><li><a href="https://doi.org/10.1016/j.engappai.2026.113908">高效鲁棒铲装控制系统</a> <a href="pdf/1-s2.0-S0952197626001892-main.pdf">[论文]</a></li><li>行业首个基于具身智能的自主堆料</li><li><a href="https://lingdong.fuxi.163.com/productSummary/cabin_cleaner">多端远程操控与辅助系统</a></li></ul>',
            'projects.excavator_title': '挖掘机器人（2021 — 2023, 2026 — 至今）',
            'projects.excavator_body': '面向人机协同应用的挖掘机自主规划与控制系统。详情：<a href="https://lingdong.fuxi.163.com/productSummary/wj?lang=en">官方网站</a> | <a href="pdf/Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation.pdf">论文</a> | <a href="https://youtu.be/N6I0WZGSF68">演示视频</a><ul><li>液压执行控制</li><li>自主挖掘</li><li>自主导航</li><li>游戏化遥操作</li></ul>',
            'projects.drl_title': '基于深度强化学习的导航（2019 — 2021）',
            'projects.drl_body': '课题组长；<a href="https://github.com/DRL-Navigation" class="bluelink">代码已在 GitHub 开源</a>。<ul><li><a href="pdf/ICNSC_2020_paper_11.pdf" class="bluelink">基于 DQN 的避障</a>，<a href="https://youtu.be/Eq4AjsFH_cU" class="bluelink">[演示]</a></li><li><a href="pdf/IROS_2021_DRQNNav.pdf" class="bluelink">基于 DRQN 的三维避障</a>，<a href="https://youtu.be/cnCid0qOZg4" class="bluelink">[演示]</a></li><li><a href="pdf/ICTAI_2020.pdf" class="bluelink">多机器人碰撞规避</a>，<a href="https://youtu.be/KOb1q23L7-U" class="bluelink">[演示]</a></li><li><a href="pdf/IROS_2021_PedNav.pdf" class="bluelink">人群导航</a>，<a href="https://www.bilibili.com/video/BV1Vb4y1D7R6" class="bluelink">[演示]</a>，<a href="gitstats/authors.html" class="bluelink" target="_blank">[代码统计]</a></li><li><a href="pdf/ICRA2022_BEEP_FINAL_06_03.pdf" class="bluelink">具备交互能力的人群导航</a></li></ul>',
            'projects.panda_title': '熊猫机器人（2020 — 2021）',
            'projects.panda_body': '部署于<a href="https://www.panda.org.cn/en/education/framework/2023-07-16/7850.html" class="bluelink">成都大熊猫博物馆</a>的导览机器人。<br>课题组长（<a href="pdf/phd_cgd.pdf#page=112" class="bluelink">博士论文</a>，<a href="pdf/phd_cgd.pdf#page=90" class="bluelink">第 4 章</a>与<a href="pdf/phd_cgd.pdf#page=112" class="bluelink">第 5 章</a>）。<br><ul><li>行人检测与跟踪，<a href="https://www.bilibili.com/video/BV1HB4y1P7xE" class="bluelink">[演示]</a></li><li>长期鲁棒定位，<a href="https://www.bilibili.com/video/BV1q5411w7qX" class="bluelink">[演示]</a></li><li>密集人群中的导航，<a href="https://www.bilibili.com/video/BV13Z4y1A7br" class="bluelink">[简要演示]</a>，<a href="https://www.bilibili.com/video/BV1wU4y1V7cA?share_source=copy_web" class="bluelink">[完整演示]</a></li><li>导览服务 v1.0，<a href="https://www.bilibili.com/video/BV1UM4y1u7t8" class="bluelink">[演示]</a></li></ul>',
            'projects.kejia_title': '可佳机器人（2015 — 2019）',
            'projects.kejia_intro': '所在队伍：<a href="http://ai.ustc.edu.cn/en/robocup/atHome">WrightEagle@Home</a><br><a href="pdf/tdp19.pdf" class="bluelink">[TDP <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>，<a href="pdf/poster19_athome.pdf" class="bluelink">[海报 <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>，<a href="pdf/ECRDC_USTC.pdf" class="bluelink">[报告 <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>，<a href="https://youtu.be/sWi9EOKIhlE" class="bluelink">[演示]</a>',
            'projects.kejia_body': '<table border="1" cellpadding="3" cellspacing="0" class="kejia-table"><tr><th>赛事</th><th>地点</th><th>奖项</th><th>角色</th></tr><tr><td><a href="http://www.rcccaa.org/zdy/gui.html" class="bluelink">RoboCup 中国公开赛 @Home 2015</a></td><td>贵阳</td><td>冠军</td><td>主力</td></tr><tr><td><a href="https://www.robocup.org/events/5" class="bluelink">RoboCup@Home 2016</a></td><td>莱比锡</td><td>季军</td><td>主力</td></tr><tr><td><a href="https://www.robocup.org/events/14" class="bluelink">亚太区 RoboCup 预选赛 2017</a></td><td>北京</td><td>冠军</td><td>主力</td></tr><tr><td><a href="https://www.robocup.org/events/6" class="bluelink">RoboCup@Home 2017</a></td><td>名古屋</td><td>最佳操作</td><td>主力</td></tr><tr><td><a href="https://www.ijcai19.org/competitions.html" class="bluelink">IJCAI-2019 养老机器人挑战赛</a></td><td>澳门</td><td>冠军</td><td>队长</td></tr></table>团队现已回归，更名为 <a href="https://wrighteagleai.homes/"><b>WrightEagle.AI</b></a>。',
            'projects.mocap_title': '动作捕捉系统（2016 — 2018）',
            'projects.mocap_body': '<p>用于测试：<br>- <a href="pdf/Cleaning_Robots_Test.pdf" class="bluelink">清洁机器人测试</a><br>- <a href="http://roboticsbase.ustc.edu.cn/" class="bluelink">安徽省机器人技术标准创新基地</a><br>用于标定：<br>- <a href="http://staff.ustc.edu.cn/~wufeng02/doc/pdf/ZCWicira17.pdf" class="bluelink">通用批量标定框架</a><br>- <a href="pdf/rgbd_cal_j.pdf" class="bluelink">RGB-D 相机标定</a><br>用于训练：<br>- <a href="http://www.sohu.com/a/217691740_100071565" class="bluelink">虚实统一仿真平台</a><br></p>',

            'pub.selected_title': '代表性论文',
            'pub.all_publications': '全部论文请见：<a href="https://scholar.google.com/citations?user=h7vRddgAAAAJ&hl=zh-CN">Google Scholar</a>、<a href="https://www.researchgate.net/profile/Guangda_Chen4">ResearchGate</a>。',
            'pub.equal_contrib': '<b>*</b> 标注作者对本工作有同等贡献。',
            'pub.loading': '正在加载论文...',
            'pub.no_data': '未找到论文数据',
            'pub.load_error': '论文加载失败：',

            'patents.title': '授权专利',
            'patents.all_patents': '全部专利请见：<a href="https://www.patentguru.com/cn/search?inventor=%22%E9%99%88%E5%B9%BF%E5%A4%A7%22&assignee=%22%E7%BD%91%E6%98%93%22,%22%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%22&SortBy=pubdate_newest">PatentGuru</a>。',
            'patents.show_more': '展开更多',
            'patents.show_less': '收起',
            'patents.award_badge': '🏆 网易年度十佳专利奖（2025）',
            'patents.load_error': '专利加载失败：',

            'academic.title': '学术服务',
            'academic.journal_reviewer': '期刊审稿人：',
            'reviewers.load_error': '审稿信息加载失败：',

            'talks.title': '学术报告',
            'talks.intro': '在学术会议与产业活动中的部分报告及演讲。',
            'talks.event_photos': '现场图片',
            'talks.intl_conf_badge': '国际会议',

            'talks.csdn.badge': 'CSDN 奇点智能大会',
            'talks.csdn.title': '数据驱动算法：无人装载机全流程作业的规模化实践',
            'talks.csdn.conference': 'CSDN 奇点智能大会',
            'talks.csdn.date': '2026 年 4 月 18 日 | 上海 环球港',
            'talks.csdn.description': '在工程机械行业面临用工荒、安全风险与效率瓶颈的多重挑战下，装载机的无人化转型已成为产业升级的核心突破口。本次演讲聚焦网易灵动在拌合站等真实工业场景的规模化落地实践，深度解析如何构建数据驱动的技术闭环，系统性攻克无人装载机从"移动导航""精准铲料"到"智能堆料"的全流程作业难题。',
            'talks.csdn.links': '报告官方链接：<a href="https://ml-summit.org/speaker/1258?uid=c1048">大会官网</a>',

            'talks.top100.badge': 'Top100 全球软件案例研究峰会',
            'talks.top100.title': '装载机无人化破局之路：数据驱动算法的全流程深度实践',
            'talks.top100.conference': 'Top100 全球软件案例研究峰会',
            'talks.top100.date': '2025 年 11 月 22 日 | 北京 中关村',
            'talks.top100.description': '由 MSUP 主办的第十四届 TOP100 全球软件案例研究峰会（TOP100 Summit）在北京圆满闭幕。本届峰会以"面向未来的组织演进与创新管理"为主题，汇聚了全球 100 余位技术创新者，探讨生成式 AI、软硬件集成等趋势下的组织变革路径。大会期间，网易伏羲规控算法负责人陈博士发表了题为《装载机无人化破局之路：数据驱动算法的全流程深度实践》的演讲，系统分享了团队在装载机无人化领域的技术探索与实践经验。',
            'talks.top100.links': '更多媒体报道：<a href="https://mp.weixin.qq.com/s/kNd0hAy7AWJeOC-iC4ZD2A">网易伏羲公众号</a><br>报告官方链接：<a href="https://www.top100summit.com/detail?aid=4733&id=18661">TOP100 官网</a>',

            'talks.ictai.title': '面向人机协同自动化的通用液压挖掘机建模与控制',
            'talks.ictai.conference': 'IEEE 第 35 届人工智能工具国际会议（ICTAI 2023）',
            'talks.ictai.date': '2023 年 11 月 | 美国 亚特兰大',
            'talks.ictai.description': '论文《Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation》在 IEEE 第 35 届人工智能工具国际会议（ICTAI 2023）上发表。该工作聚焦面向人机协同的挖掘机自动化研究，通过在线报告与国际学术界进行了交流分享。',
            'talks.ictai.links': '论文全文（PDF）：<a href="pdf/Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation.pdf">paper.pdf</a><br>演示视频：<a href="https://youtu.be/N6I0WZGSF68">YouTube</a>',

            'talks.icnsc.title': '基于地图的深度强化学习机器人导航',
            'talks.icnsc.conference': '国际网络、传感与控制会议（ICNSC 2020）',
            'talks.icnsc.date': '2020 年 10 月 | 中国 南京',
            'talks.icnsc.description': '论文《Robot Navigation with Map-Based Deep Reinforcement Learning》于 ICNSC 2020 发表。该研究提出了一种新颖的、能够有效利用栅格地图的深度强化学习导航框架，并通过口头报告的形式展示了其在求解复杂导航任务方面的创新方法。这项开创性工作为课题组后续一系列基于深度强化学习的导航研究奠定了基础，并荣获本次会议的最佳学生论文奖。',

            'footer.copyright': '© 2026 陈广大. 版权所有。',
            'footer.note': '本网站所列资料旨在便利相关学术与技术工作的及时传播。各作品的版权及其相关权益归各自作者或其他版权所有人持有。访问本网站内容的所有人员，均应遵守相应作者著作权所规定的条款与限制。在大多数情况下，未经版权持有人明确许可，相关作品不得转载或再次发布。',
            // 'footer.songjia': '易嵩佳 ORCID',
            'footer.maintained': '🤖 由 Claude Code（Anthropic）协助设计与维护',
            'footer.maintained_title': '本网站由 Anthropic 出品的 Claude Code 协助完成设计、重构与持续维护，涵盖页面布局、样式、数据加载与无障碍优化等方面。'
        }
    };

    function t(key) {
        const dict = translations[currentLang] || translations.en;
        if (dict && Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
        if (translations.en && Object.prototype.hasOwnProperty.call(translations.en, key)) return translations.en[key];
        return key;
    }

    function applyLang(lang) {
        currentLang = (lang === 'zh') ? 'zh' : 'en';
        document.documentElement.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');

        document.querySelectorAll('[data-i18n]').forEach(function (node) {
            const key = node.getAttribute('data-i18n');
            node.textContent = t(key);
        });
        document.querySelectorAll('[data-i18n-html]').forEach(function (node) {
            const key = node.getAttribute('data-i18n-html');
            node.innerHTML = t(key);
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(function (node) {
            const spec = node.getAttribute('data-i18n-attr');
            spec.split(';').forEach(function (pair) {
                const idx = pair.indexOf(':');
                if (idx <= 0) return;
                const attr = pair.substring(0, idx).trim();
                const key = pair.substring(idx + 1).trim();
                if (attr && key) node.setAttribute(attr, t(key));
            });
        });

        // Theme toggle aria-label depends on current theme
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeBtn.setAttribute('aria-label', t(isDark ? 'nav.theme_light' : 'nav.theme_dark'));
        }
        // Language toggle label
        const langBtn = document.querySelector('.lang-toggle');
        if (langBtn) {
            langBtn.textContent = currentLang === 'zh' ? 'EN' : '中';
            langBtn.setAttribute('aria-label', t('nav.lang_toggle'));
        }

        // Re-render dynamic content if already loaded
        if (papersCache) renderPapers(papersCache);
        if (patentsCache) renderPatents(patentsCache);
        if (reviewersCache) renderReviewers(reviewersCache);
    }

    function readUrlLang() {
        try {
            const params = new URLSearchParams(window.location.search);
            const v = (params.get('lang') || '').toLowerCase();
            if (v === 'zh' || v === 'cn' || v === 'zh-cn') return 'zh';
            if (v === 'en') return 'en';
        } catch (e) { /* ignore */ }
        return null;
    }

    function syncUrlLang(lang) {
        try {
            const url = new URL(window.location.href);
            if (url.searchParams.get('lang') === lang) return;
            url.searchParams.set('lang', lang);
            history.replaceState(null, '', url.toString());
        } catch (e) { /* ignore */ }
    }

    function initLang() {
        let stored = null;
        try { stored = localStorage.getItem(I18N_KEY); } catch (e) { /* ignore */ }
        const urlLang = readUrlLang();
        const initial = urlLang || stored || 'en';
        applyLang(initial);
        if (urlLang) {
            try { localStorage.setItem(I18N_KEY, urlLang); } catch (e) { /* ignore */ }
        }

        const btn = document.querySelector('.lang-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                const next = currentLang === 'zh' ? 'en' : 'zh';
                applyLang(next);
                try { localStorage.setItem(I18N_KEY, next); } catch (e) { /* ignore */ }
                syncUrlLang(next);
            });
        }
    }

    // ----- helpers --------------------------------------------------------
    function el(tag, attrs, children) {
        const node = document.createElement(tag);
        if (attrs) {
            for (const k in attrs) {
                if (k === 'class') node.className = attrs[k];
                else if (k === 'text') node.textContent = attrs[k];
                else if (k === 'html') node.innerHTML = attrs[k]; // only with trusted constants
                else if (k === 'onClick') node.addEventListener('click', attrs[k]);
                else if (attrs[k] != null) node.setAttribute(k, attrs[k]);
            }
        }
        if (children) {
            (Array.isArray(children) ? children : [children]).forEach(function (c) {
                if (c == null) return;
                node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
            });
        }
        return node;
    }

    function safeLink(href, text, cls) {
        const a = el('a', { href: href || '#', class: cls || '' });
        a.textContent = text || '';
        return a;
    }

    // For author-controlled trusted HTML strings (titles with <i>, authors with <b>/<a>, etc.)
    function htmlLink(href, htmlStr, cls) {
        const a = el('a', { href: href || '#', class: cls || '' });
        a.innerHTML = htmlStr || '';
        return a;
    }

    function skeleton(lines) {
        const wrap = el('div', { class: 'skeleton-wrap', 'aria-busy': 'true', 'aria-live': 'polite' });
        for (let i = 0; i < lines; i++) wrap.appendChild(el('div', { class: 'skeleton-line' }));
        return wrap;
    }

    function showError(container, message) {
        container.innerHTML = '';
        container.appendChild(el('div', { class: 'error', text: message }));
    }

    // ----- page navigation -----------------------------------------------
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navBtns = document.querySelectorAll('.nav-btn');
        const pageSections = document.querySelectorAll('.page-section');
        let isTransitioning = false;
        const FADE_OUT_MS = 180;

        function scrollToSection() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function showSection(sectionId, scrollToTop) {
            if (scrollToTop === undefined) scrollToTop = true;
            if (isTransitioning) return;
            const target = document.getElementById(sectionId);
            if (!target) return;

            navLinks.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + sectionId);
            });

            const visible = Array.from(pageSections).find(function (s) {
                return s.style.display !== 'none' && getComputedStyle(s).display !== 'none';
            });

            if (visible === target) {
                if (scrollToTop) scrollToSection();
                return;
            }

            const doSwap = function () {
                pageSections.forEach(function (s) {
                    s.style.display = 'none';
                    s.classList.remove('is-leaving');
                });
                target.style.display = 'block';
                void target.offsetWidth;
                if (scrollToTop) scrollToSection();
                isTransitioning = false;
            };

            if (visible) {
                isTransitioning = true;
                visible.classList.add('is-leaving');
                setTimeout(doSwap, FADE_OUT_MS);
            } else {
                doSwap();
            }
        }

        function handleHashChange() {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) showSection(hash);
            else showSection('about');
        }

        const initialHash = window.location.hash.substring(1);
        if (initialHash && document.getElementById(initialHash)) showSection(initialHash);
        else showSection('about', false);

        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);

        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                document.querySelector('.nav-menu').classList.remove('active');
                if (history.pushState) history.pushState(null, null, '#' + targetId);
                else window.location.hash = '#' + targetId;
                showSection(targetId);
            });
        });

        navBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetId = this.getAttribute('data-target');
                if (history.pushState) history.pushState(null, null, '#' + targetId);
                else window.location.hash = '#' + targetId;
                showSection(targetId);
            });
        });

        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav-menu');
        if (toggle && menu) {
            toggle.addEventListener('click', function () {
                menu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    }

    // ----- back-to-top with scroll progress ring -------------------------
    function initBackToTop() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        // inject SVG progress ring once
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'back-to-top-ring');
        svg.setAttribute('viewBox', '0 0 44 44');
        svg.setAttribute('aria-hidden', 'true');
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', '22');
        circle.setAttribute('cy', '22');
        circle.setAttribute('r', '20');
        const C = 2 * Math.PI * 20;
        circle.setAttribute('stroke-dasharray', String(C));
        circle.setAttribute('stroke-dashoffset', String(C));
        svg.appendChild(circle);
        btn.insertBefore(svg, btn.firstChild);

        let ticking = false;
        function update() {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            const pct = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
            circle.setAttribute('stroke-dashoffset', String(C * (1 - pct)));
            btn.classList.toggle('visible', h.scrollTop > 300);
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ----- lightbox -------------------------------------------------------
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;
        const lightboxImg = document.getElementById('lightbox-img');
        let lastFocus = null;

        function open(src, alt) {
            lastFocus = document.activeElement;
            lightboxImg.src = src;
            lightboxImg.alt = alt || '';
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            const closeBtn = lightbox.querySelector('.lightbox-close');
            if (closeBtn) closeBtn.focus();
        }

        function close() {
            if (!lightbox.classList.contains('active')) return;
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
            if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        }

        document.addEventListener('click', function (e) {
            const item = e.target.closest && e.target.closest('.photo-item');
            if (item) {
                const img = item.querySelector('img');
                if (img) open(img.src, img.alt);
            }
        });
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.addEventListener('click', close);
        lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }

    // ----- collapsible toggle (papers BibTeX/Abstract) -------------------
    window.toggleDisplay = function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    };

    // ----- papers ---------------------------------------------------------
    function renderPapers(papers) {
        const container = document.getElementById('papers-container');
        if (!container) return;
        container.innerHTML = '';

        if (!papers || !papers.length) {
            showError(container, t('pub.no_data'));
            return;
        }

        const frag = document.createDocumentFragment();

        papers.forEach(function (paper, index) {
            const item = el('div', { class: 'publication-item', id: 'ref' + index });

            const title = el('h4', { class: 'paper-title' }, htmlLink(paper.link, paper.title, 'bluelink'));
            item.appendChild(title);

            if (paper.sub_title) {
                item.appendChild(el('p', { class: 'paper-subtitle' }, htmlLink(paper.link, paper.sub_title, 'bluelink')));
            }

            // Authors and venue can contain trusted HTML (e.g. <b>, <a> for co-authors)
            item.appendChild(el('p', { class: 'paper-authors', html: paper.authors || '' }));

            const venue = el('p', { class: 'paper-venue' });
            const ital = el('i');
            ital.appendChild(htmlLink(paper.venueLink, paper.venue, 'bluelink'));
            venue.appendChild(ital);
            if (paper.impact_factor) {
                venue.appendChild(el('span', { class: 'paper-if', text: 'IF: ' + paper.impact_factor }));
            }
            if (paper.rating) {
                const r = el('span', { class: 'paper-rating' }, htmlLink(paper.rating_link, paper.rating, 'bluelink'));
                venue.appendChild(r);
            }
            if (paper.award) {
                venue.appendChild(el('span', { class: 'paper-award', html: paper.award }));
            }
            item.appendChild(venue);

            const links = el('div', { class: 'paper-links' });
            const bibToggle = el('a', { class: 'paper-link', text: 'BibTeX' });
            bibToggle.addEventListener('click', function () { window.toggleDisplay('bib' + index); });
            links.appendChild(bibToggle);

            if (paper.abstract) {
                const absToggle = el('a', { class: 'paper-link', text: 'Abstract' });
                absToggle.addEventListener('click', function () { window.toggleDisplay('abs' + index); });
                links.appendChild(absToggle);
            }
            const linkSpecs = [
                ['pdf', 'PDF'], ['pdf2', 'PDF2'], ['demo', 'Demo'], ['slides', 'Slides'],
                ['awardDoc', 'Award'], ['youTube', 'YouTube'], ['bili1', 'Bilibili'], ['bili2', 'Bilibili_2']
            ];
            linkSpecs.forEach(function (spec) {
                if (paper[spec[0]]) links.appendChild(safeLink(paper[spec[0]], spec[1], 'paper-link'));
            });
            item.appendChild(links);

            // bibtex is plain text (preserve line breaks via white-space CSS, no HTML)
            const bib = el('div', { id: 'bib' + index, class: 'paper-collapsible', style: 'display:none', text: paper.bibtex || '' });
            item.appendChild(bib);

            if (paper.abstract) {
                const abs = el('div', { id: 'abs' + index, class: 'paper-collapsible', style: 'display:none' });
                let absHtml = '<b>Abstract:</b> ' + (paper.abstract || '');
                if (paper.keywords) {
                    absHtml += '<br><b>Keywords:</b> ' + paper.keywords;
                }
                abs.innerHTML = absHtml;
                item.appendChild(abs);
            }

            frag.appendChild(item);
        });

        container.appendChild(frag);
    }

    function loadPapers() {
        const container = document.getElementById('papers-container');
        if (!container) return Promise.resolve();
        container.innerHTML = '';
        container.appendChild(skeleton(6));
        return fetch('papers.json')
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(function (data) { papersCache = data; renderPapers(data); })
            .catch(function (err) {
                showError(container, t('pub.load_error') + err.message);
            });
    }

    // ----- patents --------------------------------------------------------
    let patentsExpanded = false;

    function updatePatentToggleLabel(toggleBtn, hiddenCount) {
        if (!toggleBtn) return;
        if (patentsExpanded) {
            toggleBtn.textContent = t('patents.show_less');
        } else {
            toggleBtn.innerHTML = '';
            toggleBtn.appendChild(document.createTextNode(t('patents.show_more') + ' ('));
            const span = el('span', { id: 'hidden-patent-count', text: String(hiddenCount) });
            toggleBtn.appendChild(span);
            toggleBtn.appendChild(document.createTextNode(')'));
        }
    }

    function renderPatents(data) {
        const list = document.getElementById('patent-list');
        const toggleBtn = document.getElementById('patent-toggle-btn');
        if (!list || !data || !data.patents) return;
        list.innerHTML = '';
        const INITIAL = 5;
        const AWARD_URL = 'https://www.patentguru.com/cn/CN117950401B';

        data.patents.forEach(function (patent, index) {
            const item = el('div', { class: 'patent-item' });
            if (index >= INITIAL) {
                item.classList.add('patent-item-hidden');
                if (patentsExpanded) item.style.display = 'flex';
            }

            item.appendChild(el('div', { class: 'patent-number', text: (index + 1) + '.' }));

            const content = el('div', { class: 'patent-content' });
            content.appendChild(htmlLink(patent.url, patent.title, 'patent-title bluelink'));

            const meta = el('div', { class: 'patent-meta' });
            if (patent.url === AWARD_URL) {
                meta.appendChild(el('span', { class: 'patent-award-badge', text: t('patents.award_badge') }));
            }
            const patentNumber = (patent.url || '').split('/').pop();
            meta.appendChild(el('span', { class: 'patent-id', text: patentNumber }));
            content.appendChild(meta);

            item.appendChild(content);
            list.appendChild(item);
        });

        if (data.patents.length > INITIAL && toggleBtn) {
            const hiddenCount = data.patents.length - INITIAL;
            toggleBtn.style.display = 'block';
            updatePatentToggleLabel(toggleBtn, hiddenCount);
            // Replace node to drop any previously attached click handler before re-attaching
            const fresh = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(fresh, toggleBtn);
            fresh.addEventListener('click', function () {
                patentsExpanded = !patentsExpanded;
                document.querySelectorAll('.patent-item-hidden').forEach(function (it) {
                    it.style.display = patentsExpanded ? 'flex' : 'none';
                });
                updatePatentToggleLabel(fresh, hiddenCount);
            });
        }
    }

    function loadPatents() {
        const list = document.getElementById('patent-list');
        if (!list) return Promise.resolve();
        list.innerHTML = '';
        list.appendChild(skeleton(3));
        return fetch('patents.yaml')
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
            .then(function (txt) {
                if (typeof jsyaml === 'undefined') throw new Error('YAML parser not loaded');
                patentsCache = jsyaml.load(txt);
                renderPatents(patentsCache);
            })
            .catch(function (err) {
                showError(list, t('patents.load_error') + err.message);
            });
    }

    // ----- reviewers ------------------------------------------------------
    function renderReviewers(data) {
        const container = document.getElementById('reviewers-container');
        if (!container || !data || !data.reviewers) return;
        container.innerHTML = '';
        data.reviewers.forEach(function (r) {
            container.appendChild(safeLink(r.url, r.name, 'bluelink bb'));
        });
    }

    function loadReviewers() {
        const container = document.getElementById('reviewers-container');
        if (!container) return Promise.resolve();
        container.innerHTML = '';
        container.appendChild(skeleton(1));
        return fetch('reviewers_simple.yaml')
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
            .then(function (txt) {
                if (typeof jsyaml === 'undefined') throw new Error('YAML parser not loaded');
                reviewersCache = jsyaml.load(txt);
                renderReviewers(reviewersCache);
            })
            .catch(function (err) {
                showError(container, t('reviewers.load_error') + err.message);
            });
    }

    // ----- dark mode toggle ---------------------------------------------
    function initThemeToggle() {
        const KEY = 'cgd-theme';
        const root = document.documentElement;

        function apply(theme) {
            root.setAttribute('data-theme', theme);
            const btn = document.querySelector('.theme-toggle');
            if (btn) {
                btn.setAttribute('aria-label', t(theme === 'dark' ? 'nav.theme_light' : 'nav.theme_dark'));
                btn.textContent = theme === 'dark' ? '☀' : '☾';
            }
        }

        const stored = (function () {
            try { return localStorage.getItem(KEY); } catch (e) { return null; }
        })();
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        apply(stored || (prefersDark ? 'dark' : 'light'));

        const btn = document.querySelector('.theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                const cur = root.getAttribute('data-theme');
                const next = cur === 'dark' ? 'light' : 'dark';
                apply(next);
                try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
            });
        }
    }

    // ----- bootstrap ------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        initLang();
        initThemeToggle();
        initNavigation();
        initBackToTop();
        initLightbox();
        // fire data fetches in parallel
        loadPapers();
        loadPatents();
        loadReviewers();
    });
})();
