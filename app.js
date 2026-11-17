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
            'meta.title': 'Guangda Chen — CTO | Robotics, Embodied AI',
            'meta.description': 'Dr. Guangda Chen — CTO at NetEase Lingdong, Ph.D. from USTC. Research on autonomous heavy machinery, deep reinforcement learning navigation, and embodied AI.',

            'nav.projects': 'Projects',
            'nav.publications': 'Publications',
            'nav.primary': 'Main navigation',
            'nav.menu_toggle': 'Toggle menu',
            'nav.theme_dark': 'Switch to dark mode',
            'nav.theme_light': 'Switch to light mode',
            'nav.lang_toggle': 'Switch to Chinese',
            'back_to_top': 'Back to top',

            'header.name': 'Guangda Chen',

            "nav.overview": "Overview",
            "nav.talks": "Talks",
            "overview.page_label": "Personal overview",
            "overview.role": "CTO at NetEase Lingdong",
            "overview.credentials": "Ph.D., USTC · Former Postdoctoral Researcher, Zhejiang University",
            "overview.summary": "Dr. Guangda Chen is the CTO at NetEase Lingdong. He received his Ph.D. in Computer Science from the University of Science and Technology of China in 2021 and conducted postdoctoral research at Zhejiang University from 2023 to 2025. His research and engineering work focus on embodied AI, perception, planning and control for autonomous construction machinery, and deep reinforcement learning for mobile robot navigation. He works to translate robotics research into reliable industrial deployment.",
            "overview.save_cv": "Print / Save CV",
            "overview.location": "Hangzhou, China",
            "overview.highlights_title": "Selected Contributions",
            "overview.deployment_label": "Industrial Deployment",
            "overview.deployment_body": "Led the development of <a href=\"#project-loader\" class=\"nav-link\">full-process autonomous loaders</a>, from shoveling to stockpiling, with deployments in working industrial sites.",
            "overview.research_label": "Robotics Research",
            "overview.research_body": "<a href=\"#publications\" class=\"nav-link\">Research contributions</a> in map-based deep reinforcement learning navigation and hydraulic modeling and control for autonomous heavy machinery.",
            "overview.recognition_label": "Recognition",
            "overview.recognition_body": "<a href=\"pdf/ICNSC2020Award.pdf\">ICNSC 2020 Best Student Paper Award</a>, IJCAI 2019 Eldercare Robot Challenges champion, and <a href=\"#publications\" class=\"nav-link\">NetEase’s Top 10 Patents (2025)</a>.",
            "overview.experience_title": "Experience & Education",
            "overview.netease_org": "NetEase Lingdong",
            "overview.netease_role": "CTO · Autonomous Construction Machinery",
            "overview.zju_org": "Zhejiang University",
            "overview.postdoc_detail": "Postdoctoral Researcher · Control Science and Engineering<br>Advisor: Prof. <a href=\"https://person.zju.edu.cn/0097062\">Rong Xiong</a>",
            "overview.ustc_org": "University of Science and Technology of China",
            "overview.phd_detail": "Ph.D. in Computer Science<br>Advisor: Prof. <a href=\"https://cs.ustc.edu.cn/2020/0828/c23235a460075/pagem.htm\">Xiaoping Chen</a> · <a href=\"http://ai.ustc.edu.cn/\">USTC Robotics Laboratory</a>",
            "overview.ba_detail": "Bachelor of Administration · Medical Informatics",
            "overview.work_title": "Selected Work",
            "overview.all_projects": "All projects →",
            "overview.loader_title": "Autonomous Loaders",
            "overview.loader_body": "Intelligent material handling in industrial sites: autonomous navigation, robust shoveling and embodied AI-based stockpiling.",
            "overview.loader_alt": "Autonomous loader working at an industrial site",
            "overview.excavator_title": "Excavator Robots",
            "overview.excavator_body": "Hydraulic modeling, precise actuation control and autonomous planning for human-in-the-loop excavation.",
            "overview.excavator_alt": "Excavator robot and hydraulic control system",
            "overview.drl_title": "Deep Reinforcement Learning Navigation",
            "overview.drl_body": "Map-based obstacle avoidance, multi-robot collision avoidance and crowd-aware navigation, from simulation to real robots.",
            "overview.drl_alt": "Mobile robot navigating among pedestrians",
            "overview.project_details": "Project details →",
            "overview.demo": "Demo",
            "overview.code": "Code",
            "overview.news_title": "Recent Updates",
            "overview.news_type_talk": "[Talk]",
            "overview.news_type_paper": "[Paper]",
            "overview.news_arts": "ARTS 2026 · Deploying embodied AI for material interaction tasks",
            "overview.news_arts_detail": "Industry Entrepreneurship Pioneers Forum · Beijing",
            "overview.news_zju": "Zhejiang University · From automated loading to autonomous stockpiling",
            "overview.news_zju_detail": "Geotechnical Forum No. 106 · Hangzhou",
            "overview.news_paper": "Autonomous loader shoveling control research published in EAAI",

            'home.tagline': 'Robotics · Automation · Embodied AI',
            'home.contact_email': 'Email:',

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
            'projects.loader_body': 'Unmanned loader system for intelligent material handling in industrial sites like <a href="https://mp.weixin.qq.com/s/9C-TNqmk_DaHqbVDnatrDA"> batching plants, power facilities, chemical complexes and ports</a>.<br><ul><li>High-Precision Hydraulic & Propulsion Control (<a href="https://mp.weixin.qq.com/s/KPr6EH8wozEnLDP1e_gi4A">Diesel</a> / <a href="https://mp.weixin.qq.com/s/5x0-5_HSsuYDVoltJ6N4mA">Electric</a>)</li><li>Autonomous Mobility & Navigation</li><li><a href="https://doi.org/10.1016/j.engappai.2026.113908">Efficient and Robust Shoveling Control System</a> <a href="pdf/1-s2.0-S0952197626001892-main.pdf" class="project-paper-badge project-paper-badge-journal" title="Engineering Applications of Artificial Intelligence · 2026 — View paper (PDF)">EAAI 2026</a></li><li>Industry\'s First Embodied AI-based Autonomous Stacking</li><li><a href="https://lingdong.fuxi.163.com/productSummary/cabin_cleaner">Multi-Terminal Remote Control & Assistance System</a></li></ul>',
            'projects.excavator_title': 'Excavator Robot (2021 - 2023, 2026 - Present)',
            'projects.excavator_body': 'An autonomous planning and control system for excavators in human-robot collaborative applications. Details: <a href="https://lingdong.fuxi.163.com/productSummary/wj?lang=en">Official Website</a><ul><li>Hydraulic Actuation Control <a href="pdf/Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation.pdf" class="project-paper-badge" title="IEEE International Conference on Tools with Artificial Intelligence · 2023 — View paper (PDF)">ICTAI 2023</a>, <a href="https://youtu.be/N6I0WZGSF68" class="bluelink">[Demo]</a></li><li>Autonomous Digging</li><li>Autonomous Navigation</li><li>Game-Inspired Teleoperation</li></ul>',
            'projects.drl_title': 'DRL-based Navigation (2019 - 2021)',
            'projects.drl_body': 'Group Leader, <a href="https://github.com/DRL-Navigation" class="bluelink">Open source code on GitHub</a><ul><li><a href="pdf/ICNSC_2020_paper_11.pdf" class="bluelink project-paper-link" title="IEEE International Conference on Networking, Sensing and Control · 2020 — View paper (PDF)"> DQN-based Obstacle Avoidance<span class="project-paper-badge">ICNSC 2020</span></a> <a href="pdf/ICNSC2020Award.pdf" class="project-paper-award" title="ICNSC 2020 — View award certificate">Best Student Paper Award</a></li><li><a href="pdf/IROS_2021_DRQNNav.pdf" class="bluelink project-paper-link" title="IEEE/RSJ International Conference on Intelligent Robots and Systems · 2021 — View paper (PDF)"> DRQN-based 3D Obstacle Avoidance<span class="project-paper-badge">IROS 2021</span></a>, <a href="https://youtu.be/cnCid0qOZg4" class="bluelink">[Demo]</a></li><li><a href="pdf/ICTAI_2020.pdf" class="bluelink project-paper-link" title="IEEE International Conference on Tools with Artificial Intelligence · 2020 — View paper (PDF)"> Multi-Robot Collision Avoidance<span class="project-paper-badge">ICTAI 2020</span></a>, <a href="https://youtu.be/KOb1q23L7-U" class="bluelink">[Demo]</a></li><li><a href="pdf/IROS_2021_PedNav.pdf" class="bluelink project-paper-link" title="IEEE/RSJ International Conference on Intelligent Robots and Systems · 2021 — View paper (PDF)">Crowd Navigation<span class="project-paper-badge">IROS 2021</span></a>, <a href="https://www.bilibili.com/video/BV1Vb4y1D7R6" class="bluelink">[Demo]</a>, <a href="gitstats/authors.html" class="bluelink" target="_blank"> [Code statistics] </a></li><li><a href="pdf/ICRA2022_BEEP_FINAL_06_03.pdf" class="bluelink project-paper-link" title="IEEE International Conference on Robotics and Automation · 2022 — View paper (PDF)">Crowd Navigation with Interaction Capacity<span class="project-paper-badge">ICRA 2022</span></a></li></ul>',
            'projects.panda_title': 'Panda Robot (2020 - 2021)',
            'projects.panda_body': 'Tour guide robot at the <a href="https://www.panda.org.cn/en/education/framework/2023-07-16/7850.html" class="bluelink">Chengdu Giant Panda Museum.</a><br>Group Leader, (<a href="pdf/phd_cgd.pdf#page=112" class="bluelink">PhD thesis</a>, <a href="pdf/phd_cgd.pdf#page=90" class="bluelink">Ch. 4</a> and <a href="pdf/phd_cgd.pdf#page=112" class="bluelink">Ch. 5</a>)<br><ul><li>Pedestrian detection and tracking, <a href="https://www.bilibili.com/video/BV1HB4y1P7xE" class="bluelink">[Demo]</a></li><li>Long-term robust localization, <a href="https://www.bilibili.com/video/BV1q5411w7qX" class="bluelink">[Demo]</a></li><li>Navigation in dense crowds, <a href="https://www.bilibili.com/video/BV13Z4y1A7br" class="bluelink">[Brief Demo]</a>, <a href="https://www.bilibili.com/video/BV1wU4y1V7cA?share_source=copy_web" class="bluelink">[Full Demo]</a></li><li>Tour guide service v1.0, <a href="https://www.bilibili.com/video/BV1UM4y1u7t8" class="bluelink">[Demo]</a></li></ul>',
            'projects.kejia_title': 'Kejia Robot (2015 - 2019)',
            'projects.kejia_intro': 'Team: <a href="http://ai.ustc.edu.cn/en/robocup/atHome">WrightEagle@Home</a><br><a href="pdf/tdp19.pdf" class="bluelink">[TDP <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>, <a href="pdf/poster19_athome.pdf" class="bluelink">[Poster <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>, <a href="pdf/ECRDC_USTC.pdf" class="bluelink">[Report <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>, <a href="https://youtu.be/sWi9EOKIhlE" class="bluelink">[Demo]</a>',
            'projects.kejia_body': '<table border="1" cellpadding="3" cellspacing="0" class="kejia-table"><tr><th>Event</th><th>Location</th><th>Award</th><th>Role</th></tr><tr><td><a href="http://www.rcccaa.org/zdy/gui.html" class="bluelink">RoboCup China Open@Home 2015</a></td><td>Guiyang</td><td>Champion</td><td>Major</td></tr><tr><td><a href="https://www.robocup.org/events/5" class="bluelink">RoboCup@Home 2016</a></td><td>Leipzig</td><td>3rd Place</td><td>Major</td></tr><tr><td><a href="https://www.robocup.org/events/14" class="bluelink">Pre-RoboCup Asia-Pacific 2017</a></td><td>Beijing</td><td>Champion</td><td>Major</td></tr><tr><td><a href="https://www.robocup.org/events/6" class="bluelink">RoboCup@Home 2017</a></td><td>Nagoya</td><td>Best Manipulation</td><td>Major</td></tr><tr><td><a href="https://www.ijcai19.org/competitions.html" class="bluelink">IJCAI-2019 Eldercare Robot Challenges</a></td><td>Macau</td><td>Champion</td><td>Leader</td></tr></table>The team is back, now at <a href="https://wrighteagleai.homes/"><b>WrightEagle.AI</b></a>',
            'projects.mocap_title': 'MoCap System (2016 - 2018)',
            'projects.mocap_body': '<p>for Testing:<br>- <a href="pdf/Cleaning_Robots_Test.pdf" class="bluelink project-paper-link" title="International Conference on Intelligent Robotics and Applications · 2017 — View paper (PDF)">Cleaning Robots Test<span class="project-paper-badge">ICIRA 2017</span></a><br>- <a href="http://roboticsbase.ustc.edu.cn/" class="bluelink">Anhui Robot Technology Standard Innovation Base</a><br>for Calibration:<br>- <a href="http://staff.ustc.edu.cn/~wufeng02/doc/pdf/ZCWicira17.pdf" class="bluelink project-paper-link" title="International Conference on Intelligent Robotics and Applications · 2017 — View paper (PDF)">General Batch-Calibration Framework<span class="project-paper-badge">ICIRA 2017</span></a><br>- <a href="pdf/rgbd_cal_j.pdf" class="bluelink project-paper-link" title="IEEE Sensors Journal · 2019 — View paper (PDF)">RGB-D Cameras Calibration<span class="project-paper-badge project-paper-badge-journal">IEEE Sens. J. 2019</span></a><br>for Training:<br>- <a href="http://www.sohu.com/a/217691740_100071565" class="bluelink">Real Simulation Unified Platform</a><br></p>',

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

            'talks.arts.badge': 'ARTS 2026',
            'talks.arts.title': 'Deploying Embodied AI for Material Interaction Tasks in Construction Machinery',
            'talks.arts.conference': '4th Autonomous Robotic Technology Seminar (ARTS 2026) · Industry Entrepreneurship Pioneers Forum',
            'talks.arts.date': 'October 30–31, 2026 | Capital International Convention Center, Beijing',
            'talks.arts.description': 'This talk focused on material interaction tasks in construction machinery, including loader shoveling and stockpiling and excavator truck loading. It shared practical deployments of embodied AI: combining rule-based and data-driven methods for full-process autonomous loader operations in working batching plants, and using the end-to-end Lingjue embodied model for autonomous excavator truck loading in open-pit mines under challenging operating conditions.',
            'talks.arts.links': 'Related coverage: <a href="https://mp.weixin.qq.com/s/8eG1aH8xbU6MRUMwHONTVw">Event coverage</a><br>Forum announcement: <a href="https://mp.weixin.qq.com/s/SbAWjmrIWU5sOkz6LsI7dA">Speakers and talk overview</a>',
            'talks.arts.photo_speaker': 'Guangda Chen presenting at ARTS 2026',
            'talks.arts.photo_podium': 'Guangda Chen speaking at the ARTS 2026 podium',
            'talks.arts.photo_slides': 'Guangda Chen explaining autonomous loader shoveling at ARTS 2026',

            'talks.zju.badge': 'Geotechnical Forum No. 106',
            'talks.zju.title': 'Data-Driven Intelligent Operation for Construction Machinery: From Automated Loading to Autonomous Stockpiling',
            'talks.zju.conference': 'Geotechnical Forum No. 106, Zhejiang University',
            'talks.zju.date': 'August 15, 2026 | Anzhong Building A216, Zhejiang University, Hangzhou',
            'talks.zju.description': 'This invited talk presented the data-driven approach behind intelligent and autonomous loaders in complex industrial environments such as concrete batching plants. It covered the development of full-process autonomous operation from automated loading to autonomous stockpiling, routine unmanned deployment at real sites, and the potential transfer of these technologies to ports, mines, and other scenarios.',
            'talks.zju.links': 'Official event page: <a href="https://www.zjdxyt.com/discovery/info/15084">Zhejiang University Coastal and Urban Geotechnical Engineering Research Center</a>',

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
            'footer.maintained': '🤖 Designed & maintained with DeepSeek',
            'footer.maintained_title': 'This site was designed and maintained with DeepSeek — covering layout, styling, data loading, and accessibility improvements.'
        },
        zh: {
            'meta.title': '陈广大 — 网易灵动技术负责人 | 机器人、具身智能',
            'meta.description': '陈广大博士 — 网易灵动技术负责人，中国科学技术大学博士。研究方向涵盖重型机械自主作业、深度强化学习导航与具身智能。',

            'nav.projects': '项目',
            'nav.publications': '论著',
            'nav.primary': '主导航',
            'nav.menu_toggle': '切换菜单',
            'nav.theme_dark': '切换至深色模式',
            'nav.theme_light': '切换至浅色模式',
            'nav.lang_toggle': '切换至英文',
            'back_to_top': '返回顶部',

            'header.name': '陈广大',

            "nav.overview": "个人概览",
            "nav.talks": "学术报告",
            "overview.page_label": "个人概览",
            "overview.role": "网易灵动技术负责人",
            "overview.credentials": "中国科学技术大学计算机博士 · 浙江大学控制学院博士后",
            "overview.summary": "陈广大，现任网易灵动技术负责人。2021 年获中国科学技术大学计算机科学博士学位，2023—2025 年在浙江大学控制科学与工程学院开展博士后研究。长期从事机器人具身智能与工程机械自主作业研究，重点关注智能感知、规划控制及基于深度强化学习的移动机器人导航，致力于推动无人装载机、挖掘机器人等技术在真实工业场景中的研发与应用。",
            "overview.save_cv": "打印 / 保存 CV",
            "overview.location": "中国 · 杭州",
            "overview.highlights_title": "精选成果",
            "overview.deployment_label": "工业落地",
            "overview.deployment_body": "主导<a href=\"#project-loader\" class=\"nav-link\">无人装载机全流程作业系统</a>研发，从自主铲料到具身智能堆料，推动系统在真实工业场景中常态化运行。",
            "overview.research_label": "学术研究",
            "overview.research_body": "围绕基于地图的深度强化学习导航、液压重型机械建模与控制开展<a href=\"#publications\" class=\"nav-link\">学术研究</a>，关注机器人在复杂环境中的自主作业能力。",
            "overview.recognition_label": "技术认可",
            "overview.recognition_body": "获<a href=\"pdf/ICNSC2020Award.pdf\">ICNSC 2020 最佳学生论文奖</a>、IJCAI 2019 养老机器人挑战赛冠军，以及<a href=\"#publications\" class=\"nav-link\">2025 网易十佳专利奖</a>。",
            "overview.experience_title": "工作与教育经历",
            "overview.netease_org": "网易灵动",
            "overview.netease_role": "技术负责人 · 工程机械智能化与自主作业",
            "overview.zju_org": "浙江大学",
            "overview.postdoc_detail": "控制科学与工程学院 · 博士后<br>合作导师：<a href=\"https://person.zju.edu.cn/0097062\">熊蓉</a>教授",
            "overview.ustc_org": "中国科学技术大学",
            "overview.phd_detail": "计算机科学 · 博士<br>导师：<a href=\"https://cs.ustc.edu.cn/2020/0828/c23235a460075/pagem.htm\">陈小平</a>教授 · <a href=\"http://ai.ustc.edu.cn/\">中国科大机器人实验室</a>",
            "overview.ba_detail": "管理学学士 · 医学信息学",
            "overview.work_title": "代表工作",
            "overview.all_projects": "全部项目 →",
            "overview.loader_title": "无人装载机",
            "overview.loader_body": "面向工业场景的智能物料搬运系统，涵盖自主导航、高效鲁棒铲料与基于具身智能的自主堆料。",
            "overview.loader_alt": "在工业现场作业的无人装载机",
            "overview.excavator_title": "挖掘机器人",
            "overview.excavator_body": "面向人机协同作业的液压建模、精准执行控制与自主规划，推动挖掘机作业自动化。",
            "overview.excavator_alt": "挖掘机器人及液压控制系统",
            "overview.drl_title": "深度强化学习导航",
            "overview.drl_body": "基于地图的避障、多机器人碰撞规避与人群导航，实现从仿真训练到真实机器人部署。",
            "overview.drl_alt": "在行人环境中导航的移动机器人",
            "overview.project_details": "项目详情 →",
            "overview.demo": "演示",
            "overview.code": "开源代码",
            "overview.news_title": "近期动态",
            "overview.news_type_talk": "[报告]",
            "overview.news_type_paper": "[论文]",
            "overview.news_arts": "ARTS 2026 · 具身智能在工程机械物料交互作业中的落地实践",
            "overview.news_arts_detail": "企业创业先锋论坛 · 北京",
            "overview.news_zju": "浙江大学 · 从自动上料到自主堆料",
            "overview.news_zju_detail": "“岩土论道”第 106 期学术报告 · 杭州",
            "overview.news_paper": "无人装载机高效鲁棒铲装控制研究发表于 EAAI",

            'home.tagline': '机器人 · 自动化 · 具身智能',
            'home.contact_email': '邮箱：',

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
            'projects.loader_body': '面向<a href="https://mp.weixin.qq.com/s/9C-TNqmk_DaHqbVDnatrDA">拌合站、电厂、化工园区与港口</a>等工业场景的无人装载机系统，用于物料的智能化搬运作业。<br><ul><li>高精度液压与行驶控制（<a href="https://mp.weixin.qq.com/s/KPr6EH8wozEnLDP1e_gi4A">柴油</a> / <a href="https://mp.weixin.qq.com/s/5x0-5_HSsuYDVoltJ6N4mA">电动</a>）</li><li>自主移动与导航</li><li><a href="https://doi.org/10.1016/j.engappai.2026.113908">高效鲁棒铲装控制系统</a> <a href="pdf/1-s2.0-S0952197626001892-main.pdf" class="project-paper-badge project-paper-badge-journal" title="Engineering Applications of Artificial Intelligence · 2026 — 点击查看论文（PDF）">EAAI 2026</a></li><li>行业首个基于具身智能的自主堆料</li><li><a href="https://lingdong.fuxi.163.com/productSummary/cabin_cleaner">多端远程操控与辅助系统</a></li></ul>',
            'projects.excavator_title': '挖掘机器人（2021 — 2023, 2026 — 至今）',
            'projects.excavator_body': '面向人机协同应用的挖掘机自主规划与控制系统。详情：<a href="https://lingdong.fuxi.163.com/productSummary/wj?lang=en">官方网站</a><ul><li>液压执行控制 <a href="pdf/Modeling and Control of General Hydraulic Excavator for Human-in-the-loop Automation.pdf" class="project-paper-badge" title="IEEE International Conference on Tools with Artificial Intelligence · 2023 — 点击查看论文（PDF）">ICTAI 2023</a>，<a href="https://youtu.be/N6I0WZGSF68" class="bluelink">[演示]</a></li><li>自主挖掘</li><li>自主导航</li><li>游戏化遥操作</li></ul>',
            'projects.drl_title': '基于深度强化学习的导航（2019 — 2021）',
            'projects.drl_body': '课题组长；<a href="https://github.com/DRL-Navigation" class="bluelink">代码已在 GitHub 开源</a>。<ul><li><a href="pdf/ICNSC_2020_paper_11.pdf" class="bluelink project-paper-link" title="IEEE International Conference on Networking, Sensing and Control · 2020 — 点击查看论文（PDF）">基于 DQN 的避障<span class="project-paper-badge">ICNSC 2020</span></a> <a href="pdf/ICNSC2020Award.pdf" class="project-paper-award" title="ICNSC 2020 — 查看获奖证书">最佳学生论文奖</a>，<a href="https://youtu.be/Eq4AjsFH_cU" class="bluelink">[演示]</a></li><li><a href="pdf/IROS_2021_DRQNNav.pdf" class="bluelink project-paper-link" title="IEEE/RSJ International Conference on Intelligent Robots and Systems · 2021 — 点击查看论文（PDF）">基于 DRQN 的三维避障<span class="project-paper-badge">IROS 2021</span></a>，<a href="https://youtu.be/cnCid0qOZg4" class="bluelink">[演示]</a></li><li><a href="pdf/ICTAI_2020.pdf" class="bluelink project-paper-link" title="IEEE International Conference on Tools with Artificial Intelligence · 2020 — 点击查看论文（PDF）">多机器人碰撞规避<span class="project-paper-badge">ICTAI 2020</span></a>，<a href="https://youtu.be/KOb1q23L7-U" class="bluelink">[演示]</a></li><li><a href="pdf/IROS_2021_PedNav.pdf" class="bluelink project-paper-link" title="IEEE/RSJ International Conference on Intelligent Robots and Systems · 2021 — 点击查看论文（PDF）">人群导航<span class="project-paper-badge">IROS 2021</span></a>，<a href="https://www.bilibili.com/video/BV1Vb4y1D7R6" class="bluelink">[演示]</a>，<a href="gitstats/authors.html" class="bluelink" target="_blank">[代码统计]</a></li><li><a href="pdf/ICRA2022_BEEP_FINAL_06_03.pdf" class="bluelink project-paper-link" title="IEEE International Conference on Robotics and Automation · 2022 — 点击查看论文（PDF）">具备交互能力的人群导航<span class="project-paper-badge">ICRA 2022</span></a></li></ul>',
            'projects.panda_title': '熊猫机器人（2020 — 2021）',
            'projects.panda_body': '部署于<a href="https://www.panda.org.cn/en/education/framework/2023-07-16/7850.html" class="bluelink">成都大熊猫博物馆</a>的导览机器人。<br>课题组长（<a href="pdf/phd_cgd.pdf#page=112" class="bluelink">博士论文</a>，<a href="pdf/phd_cgd.pdf#page=90" class="bluelink">第 4 章</a>与<a href="pdf/phd_cgd.pdf#page=112" class="bluelink">第 5 章</a>）。<br><ul><li>行人检测与跟踪，<a href="https://www.bilibili.com/video/BV1HB4y1P7xE" class="bluelink">[演示]</a></li><li>长期鲁棒定位，<a href="https://www.bilibili.com/video/BV1q5411w7qX" class="bluelink">[演示]</a></li><li>密集人群中的导航，<a href="https://www.bilibili.com/video/BV13Z4y1A7br" class="bluelink">[简要演示]</a>，<a href="https://www.bilibili.com/video/BV1wU4y1V7cA?share_source=copy_web" class="bluelink">[完整演示]</a></li><li>导览服务 v1.0，<a href="https://www.bilibili.com/video/BV1UM4y1u7t8" class="bluelink">[演示]</a></li></ul>',
            'projects.kejia_title': '可佳机器人（2015 — 2019）',
            'projects.kejia_intro': '所在队伍：<a href="http://ai.ustc.edu.cn/en/robocup/atHome">WrightEagle@Home</a><br><a href="pdf/tdp19.pdf" class="bluelink">[TDP <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>，<a href="pdf/poster19_athome.pdf" class="bluelink">[海报 <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>，<a href="pdf/ECRDC_USTC.pdf" class="bluelink">[报告 <img src="./pic/pdf.gif" loading="lazy" decoding="async">]</a>，<a href="https://youtu.be/sWi9EOKIhlE" class="bluelink">[演示]</a>',
            'projects.kejia_body': '<table border="1" cellpadding="3" cellspacing="0" class="kejia-table"><tr><th>赛事</th><th>地点</th><th>奖项</th><th>角色</th></tr><tr><td><a href="http://www.rcccaa.org/zdy/gui.html" class="bluelink">RoboCup 中国公开赛 @Home 2015</a></td><td>贵阳</td><td>冠军</td><td>主力</td></tr><tr><td><a href="https://www.robocup.org/events/5" class="bluelink">RoboCup@Home 2016</a></td><td>莱比锡</td><td>季军</td><td>主力</td></tr><tr><td><a href="https://www.robocup.org/events/14" class="bluelink">亚太区 RoboCup 预选赛 2017</a></td><td>北京</td><td>冠军</td><td>主力</td></tr><tr><td><a href="https://www.robocup.org/events/6" class="bluelink">RoboCup@Home 2017</a></td><td>名古屋</td><td>最佳操作</td><td>主力</td></tr><tr><td><a href="https://www.ijcai19.org/competitions.html" class="bluelink">IJCAI-2019 养老机器人挑战赛</a></td><td>澳门</td><td>冠军</td><td>队长</td></tr></table>团队现已回归，更名为 <a href="https://wrighteagleai.homes/"><b>WrightEagle.AI</b></a>。',
            'projects.mocap_title': '动作捕捉系统（2016 — 2018）',
            'projects.mocap_body': '<p>用于测试：<br>- <a href="pdf/Cleaning_Robots_Test.pdf" class="bluelink project-paper-link" title="International Conference on Intelligent Robotics and Applications · 2017 — 点击查看论文（PDF）">清洁机器人测试<span class="project-paper-badge">ICIRA 2017</span></a><br>- <a href="http://roboticsbase.ustc.edu.cn/" class="bluelink">安徽省机器人技术标准创新基地</a><br>用于标定：<br>- <a href="http://staff.ustc.edu.cn/~wufeng02/doc/pdf/ZCWicira17.pdf" class="bluelink project-paper-link" title="International Conference on Intelligent Robotics and Applications · 2017 — 点击查看论文（PDF）">通用批量标定框架<span class="project-paper-badge">ICIRA 2017</span></a><br>- <a href="pdf/rgbd_cal_j.pdf" class="bluelink project-paper-link" title="IEEE Sensors Journal · 2019 — 点击查看论文（PDF）">RGB-D 相机标定<span class="project-paper-badge project-paper-badge-journal">IEEE Sens. J. 2019</span></a><br>用于训练：<br>- <a href="http://www.sohu.com/a/217691740_100071565" class="bluelink">虚实统一仿真平台</a><br></p>',

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

            'talks.arts.badge': 'ARTS 2026',
            'talks.arts.title': '具身智能在工程机械物料交互作业中的落地实践',
            'talks.arts.conference': '第四届自主机器人技术研讨会（ARTS 2026）· 企业创业先锋论坛',
            'talks.arts.date': '2026 年 10 月 30–31 日 | 北京 · 首都国际会议中心',
            'talks.arts.description': '本报告聚焦装载机铲料、堆料与挖掘机装车等工程机械物料交互任务，分享具身智能从技术研究到真实场景落地的实践：通过融合规则与数据驱动方法，实现装载机全流程无人作业与拌合站常态化运营；通过“灵掘”端到端具身模型，探索露天矿山挖掘机自主装车及复杂环境下的工程应用。',
            'talks.arts.links': '相关报道：<a href="https://mp.weixin.qq.com/s/8eG1aH8xbU6MRUMwHONTVw">活动报道</a><br>论坛介绍：<a href="https://mp.weixin.qq.com/s/SbAWjmrIWU5sOkz6LsI7dA">嘉宾阵容与报告介绍</a>',
            'talks.arts.photo_speaker': '陈广大在 ARTS 2026 现场作报告',
            'talks.arts.photo_podium': '陈广大在 ARTS 2026 讲台前演讲',
            'talks.arts.photo_slides': '陈广大在 ARTS 2026 讲解装载机自主铲料技术',

            'talks.zju.badge': '岩土论道 第 106 期',
            'talks.zju.title': '基于数据驱动的工程机械智能作业技术：从自动上料到自主堆料',
            'talks.zju.conference': '浙江大学“岩土论道”第 106 期学术报告',
            'talks.zju.date': '2026 年 8 月 15 日 | 浙江大学紫金港校区 安中大楼 A216',
            'talks.zju.description': '本报告围绕混凝土拌合站等复杂工业场景下的装载机智能化与无人化实践，介绍“数据驱动”的技术路线，分享从自动上料到自主堆料的全流程无人作业能力建设、常态化无人运营情况，以及相关技术向港口、矿山等场景迁移的探索。',
            'talks.zju.links': '报告官方链接：<a href="https://www.zjdxyt.com/discovery/info/15084">浙江大学滨海和城市岩土工程研究中心</a>',

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
            'footer.maintained': '🤖 由 DeepSeek 协助设计与维护',
            'footer.maintained_title': '本网站由 DeepSeek 协助设计与维护，涵盖页面布局、样式、数据加载与无障碍优化等方面。'
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
        const pageSections = document.querySelectorAll('.page-section');
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav-menu');
        function setMenuOpen(open) {
            if (menu) menu.classList.toggle('active', open);
            if (toggle) {
                toggle.classList.toggle('active', open);
                toggle.setAttribute('aria-expanded', String(open));
            }
        }
        let transitionTimer = null;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const FADE_OUT_MS = reducedMotion ? 0 : 180;

        function resolveRoute(hash) {
            let id = hash.replace(/^#/, '');
            try { id = decodeURIComponent(id); } catch (e) { /* use the original hash */ }
            if (!id || id === 'home' || id === 'about') id = 'overview';
            const target = document.getElementById(id);
            const section = target && target.closest('.page-section');
            const overview = document.getElementById('overview');
            return { target: section ? target : overview, section: section || overview };
        }

        function scrollToTarget(target) {
            const behavior = reducedMotion ? 'auto' : 'smooth';
            if (target.classList.contains('page-section')) {
                window.scrollTo({ top: 0, behavior: behavior });
            } else {
                target.scrollIntoView({ block: 'start', behavior: behavior });
            }
        }

        function showRoute(route, scroll) {
            if (!route.section) return;
            if (transitionTimer !== null) clearTimeout(transitionTimer);
            transitionTimer = null;
            pageSections.forEach(function (section) { section.classList.remove('is-leaving'); });
            document.querySelectorAll('.nav-menu .nav-link').forEach(function (link) {
                const active = link.getAttribute('href') === '#' + route.section.id;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'page');
                else link.removeAttribute('aria-current');
            });

            const visible = Array.from(pageSections).find(function (section) {
                return section.style.display !== 'none' && getComputedStyle(section).display !== 'none';
            });
            if (visible === route.section) {
                if (scroll) scrollToTarget(route.target);
                return;
            }

            function swap() {
                pageSections.forEach(function (section) {
                    section.style.display = 'none';
                    section.classList.remove('is-leaving');
                });
                route.section.style.display = 'block';
                transitionTimer = null;
                if (scroll) scrollToTarget(route.target);
            }
            if (visible && FADE_OUT_MS) {
                visible.classList.add('is-leaving');
                transitionTimer = setTimeout(swap, FADE_OUT_MS);
            } else swap();
        }

        function routeFromLocation() {
            const route = resolveRoute(window.location.hash);
            // Preserve old bookmarks while making Overview the canonical landing page.
            if (/^#(?:home|about)$/.test(window.location.hash)) {
                history.replaceState(null, '', '#overview');
            }
            return route;
        }

        function handleHashChange() { showRoute(routeFromLocation(), true); }
        showRoute(routeFromLocation(), Boolean(window.location.hash));
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);

        // Delegation also handles links re-created by a language switch.
        document.addEventListener('click', function (event) {
            if (menu && menu.classList.contains('active') && !event.target.closest('.site-header')) setMenuOpen(false);
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const control = event.target.closest('a.nav-link, button.nav-btn');
            if (!control || control.hasAttribute('download') || control.getAttribute('target') === '_blank') return;
            const hash = control.tagName === 'A' ? control.getAttribute('href') : '#' + control.getAttribute('data-target');
            if (!hash || hash.charAt(0) !== '#') return;
            event.preventDefault();
            setMenuOpen(false);
            const route = resolveRoute(hash);
            const canonical = '#' + route.target.id;
            if (window.location.hash !== canonical) history.pushState(null, '', canonical);
            showRoute(route, true);
        });

        if (toggle && menu) {
            setMenuOpen(false);
            toggle.addEventListener('click', function () { setMenuOpen(!menu.classList.contains('active')); });
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' && menu.classList.contains('active')) {
                    setMenuOpen(false);
                    toggle.focus();
                }
            });
            const desktop = window.matchMedia('(min-width: 769px)');
            desktop.addEventListener('change', function (event) { if (event.matches) setMenuOpen(false); });
        }
    }

    // Export only public Overview content, rather than the private recruiting CV.
    function initCvPrint() {
        const button = document.getElementById('cv-print');
        if (!button) return;
        function clearPrintMode() { document.body.classList.remove('print-overview'); }
        window.addEventListener('afterprint', clearPrintMode);
        button.addEventListener('click', function () {
            document.body.classList.add('print-overview');
            // print() blocks until the dialog closes in standard browsers; the
            // finalizer also cleans up when printing is unsupported or ignored.
            try { window.print(); }
            finally { clearPrintMode(); }
        });
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
        initCvPrint();
        initBackToTop();
        initLightbox();
        // fire data fetches in parallel
        loadPapers();
        loadPatents();
        loadReviewers();
    });
})();
