import { profile, projects } from './portfolio-data.js';
import { projectDetails } from './project-details.js';

const external = (link, url) => { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; return link; };
const grid = document.querySelector('#project-grid');
const status = document.querySelector('#work-status');
const dialog = document.createElement('dialog');
dialog.className = 'project-viewer';
dialog.setAttribute('aria-labelledby', 'project-title');
document.body.append(dialog);
let opener;
function showProject(project, trigger) {
  opener = trigger;
  dialog.replaceChildren();
  const close = document.createElement('button');
  close.className = 'dialog-close'; close.textContent = '×'; close.setAttribute('aria-label', 'Close project details');
  close.addEventListener('click', () => dialog.close());
  const content = document.createElement('div'); content.className = 'dialog-content';
  const category = document.createElement('span'); category.className = 'eyebrow'; category.textContent = project.category;
  const title = document.createElement('h2'); title.id = 'project-title'; title.textContent = project.title;
  const hint = document.createElement('p'); hint.className = 'viewer-hint'; hint.textContent = 'Scroll to explore the full project. Close to return to my work.';
  content.append(category, title, hint, close);
  const gallery = document.createElement('div'); gallery.className = 'project-pages';
  gallery.setAttribute('role','region'); gallery.setAttribute('aria-label',project.title + ' full presentation');
  gallery.tabIndex = 0;
  const pages = projectDetails[project.id] || [{type:'image',src:project.coverImage}];
  pages.forEach((page,index) => {
    if (page.type === 'image') {
      const image = document.createElement('img');
      image.src = page.src; image.alt = `${project.title} — design visual ${index+1} of ${pages.length}`;
      image.loading = index === 0 ? 'eager' : 'lazy'; image.decoding = 'async';
      image.addEventListener('error', () => {
        const message = document.createElement('p'); message.className = 'page-error';
        message.textContent = 'This visual could not load. Please check your connection and reopen the project.';
        image.replaceWith(message);
      },{once:true});
      gallery.append(image);
    } else if (page.type === 'video') {
      const frame = document.createElement('iframe'); frame.className = 'project-video';
      frame.src = page.src; frame.title = project.title + ' — video demonstration';
      frame.allowFullscreen = true; frame.allow = 'fullscreen';
      frame.referrerPolicy = 'strict-origin-when-cross-origin'; gallery.append(frame);
    }
  });
  dialog.append(content, gallery);
  document.body.classList.add('project-open');
  dialog.showModal();
}
dialog.addEventListener('close', () => {
  dialog.replaceChildren(); // Unload the embedded presentation when the viewer closes.
  document.body.classList.remove('project-open');
  opener?.focus();
});
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });

function projectCard(project) {
  const article = document.createElement('article'); article.className = 'project-card';
  const cover = document.createElement('button'); cover.className = 'cover-button'; cover.setAttribute('aria-label', 'View details for ' + project.title);
  const img = document.createElement('img'); img.src = project.coverImage; img.alt = project.title + ' — original project cover'; img.loading = 'lazy'; img.width = 808; img.height = 632;
  img.addEventListener('error', () => { img.hidden = true; const fallback = document.createElement('span'); fallback.className = 'image-fallback'; fallback.textContent = 'Cover unavailable · open the project to view its visuals'; cover.append(fallback); }, {once:true});
  const label = document.createElement('span'); label.className = 'view-label'; label.textContent = 'Explore project ↗';
  cover.append(img,label); cover.addEventListener('click', () => showProject(project,cover));
  const info = document.createElement('div'); info.className = 'project-info';
  const text = document.createElement('div'); const title = document.createElement('h3'); title.textContent = project.title;
  const category = document.createElement('p'); category.className = 'project-category'; category.textContent = project.category; text.append(title,category);
  const link = document.createElement('button'); link.type = 'button'; link.className = 'project-arrow'; link.textContent = '↗'; link.setAttribute('aria-label','Open full project: ' + project.title);
  link.addEventListener('click', () => showProject(project,link));
  info.append(text,link); article.append(cover,info); return article;
}
function renderProjects(filter = 'All') {
  const matches = projects.filter(p => filter === 'All' || p.category === filter);
  grid.replaceChildren(...matches.map(projectCard));
  if (!matches.length) {
    const empty = document.createElement('div'); empty.className = 'empty-state';
    const title = document.createElement('h3'); title.textContent = filter === 'Presentation Design' ? 'Presentation stories, coming soon.' : 'More explorations, coming soon.';
    const p = document.createElement('p'); p.textContent = filter === 'Presentation Design' ? 'Public presentation samples are being added. My experience includes presales proposals, pitch decks, PowerPoint templates, and infographics.' : 'New work will appear here once project details and visuals are available.';
    const link = external(document.createElement('a'),profile.behance); link.className = 'text-link'; link.textContent = 'Explore my public work on Behance ↗'; empty.append(title,p,link); grid.append(empty);
  }
  status.textContent = `${matches.length} ${filter === 'All' ? '' : filter + ' '}projects shown.`;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active',b === button); b.setAttribute('aria-pressed',String(b === button)); });
  renderProjects(button.dataset.filter);
}));
renderProjects();

const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
function closeMenu(){ nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e => { if(e.key === 'Escape' && nav.classList.contains('open')){closeMenu();menu.focus();} });
if (profile.portrait) { const img = document.createElement('img'); img.src = profile.portrait; img.alt = 'Sharmila Fathima, Visual Designer'; img.fetchPriority = 'high'; document.querySelector('#portrait').replaceChildren(img); }
if (profile.resume) { const link = external(document.createElement('a'),profile.resume); link.className = 'text-link'; link.textContent = 'View my résumé ↗'; document.querySelector('#resume-hero').replaceWith(link); }
const contactLinks = document.querySelector('#contact-links');
for (const [label,url] of [['Email',profile.email ? 'mailto:'+profile.email : null],['LinkedIn',profile.linkedin],['Behance',profile.behance],['Résumé',profile.resume]]) {
  if (url) { const a = document.createElement('a'); if(url.startsWith('mailto:')) a.href = url; else external(a,url); const text = document.createElement('span'); text.textContent = label; const arrow = document.createElement('span'); arrow.textContent = '↗'; a.append(text,arrow); contactLinks.append(a); }
  else { const pending = document.createElement('div'); pending.className = 'pending-link'; const name = document.createElement('span'); name.textContent = label; const note = document.createElement('small'); note.textContent = 'To be added'; pending.append(name,note); contactLinks.append(pending); }
}
if(profile.email || profile.linkedin) document.querySelector('#contact-note').hidden = true;
document.querySelector('#year').textContent = new Date().getFullYear();

const disciplineStrip = document.querySelector('.discipline-strip');
const disciplineTrack = document.querySelector('.discipline-track');
const disciplineList = document.querySelector('.discipline-items');
const pauseDisciplines = document.querySelector('.discipline-pause');
if (disciplineList && pauseDisciplines) {
  const repeatedDisciplines = disciplineList.cloneNode(true);
  repeatedDisciplines.setAttribute('aria-hidden','true');
  repeatedDisciplines.inert = true;
  disciplineTrack.append(repeatedDisciplines);
  pauseDisciplines.addEventListener('click', () => {
    const paused = disciplineStrip.classList.toggle('paused');
    pauseDisciplines.setAttribute('aria-pressed',String(paused));
    pauseDisciplines.setAttribute('aria-label',paused ? 'Resume scrolling design skills' : 'Pause scrolling design skills');
    pauseDisciplines.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
  });
}

const toolsMarquee = document.querySelector('.tools-marquee');
const toolsTrack = document.querySelector('.tools-track');
const toolsList = toolsTrack?.querySelector('.tool-grid');
const pauseTools = document.querySelector('.tools-pause');
if (toolsList && pauseTools) {
  const repeatedTools = toolsList.cloneNode(true);
  repeatedTools.setAttribute('aria-hidden','true');
  repeatedTools.removeAttribute('aria-label');
  repeatedTools.inert = true;
  toolsTrack.append(repeatedTools);
  pauseTools.addEventListener('click', () => {
    const paused = toolsMarquee.classList.toggle('paused');
    pauseTools.setAttribute('aria-pressed',String(paused));
    pauseTools.setAttribute('aria-label',paused ? 'Resume automatic tool scrolling' : 'Pause automatic tool scrolling');
    pauseTools.replaceChildren(document.createTextNode(paused ? 'Resume scrolling ' : 'Pause scrolling '));
    const symbol = document.createElement('span'); symbol.setAttribute('aria-hidden','true'); symbol.textContent = paused ? '▷' : 'Ⅱ'; pauseTools.append(symbol);
  });
}
