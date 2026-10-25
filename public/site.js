const viewer=document.querySelector('#image-viewer');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const image=button.querySelector('img');viewer.querySelector('img').src=button.dataset.image;viewer.querySelector('img').alt=image.alt;viewer.querySelector('p').textContent=image.alt;viewer.showModal();}));
viewer.querySelector('.close').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('[data-post-category]').forEach(row=>row.hidden=button.dataset.category!=='all'&&row.dataset.postCategory!==button.dataset.category);}));

// Public repository counts refresh without credentials or a build step.
const starBadges=[...document.querySelectorAll('[data-repo]')];
const starCacheTTL=10*60*1000;
function readStarCache(repo){try{return JSON.parse(localStorage.getItem('repo-stars:'+repo));}catch{return null;}}
function showStars(badge,count,at){
 if(!Number.isSafeInteger(count)||count<0)return;
 badge.hidden=count<10;
 badge.querySelector('.star-count').textContent=count.toLocaleString('en-US');
 badge.setAttribute('aria-label',`${badge.dataset.repo}: ${count} GitHub stars`);
 badge.title=`GitHub stars · Updated ${new Date(at).toLocaleString()}`;
}
let updatingStars=false;
const starAttempts=new Map();
async function refreshStars(){
 if(updatingStars||document.hidden)return;
 updatingStars=true;
 try{await Promise.allSettled(starBadges.map(async badge=>{
  const repo=badge.dataset.repo;
  if(!/^[\w.-]+\/[\w.-]+$/.test(repo))return;
  const cached=readStarCache(repo);
  if(cached&&Number.isSafeInteger(cached.count)&&Date.now()-cached.at<starCacheTTL){showStars(badge,cached.count,cached.at);return;}
  if(Date.now()-(starAttempts.get(repo)||0)<starCacheTTL)return;
  starAttempts.set(repo,Date.now());
  try{
   const response=await fetch(`https://api.github.com/repos/${repo}`,{headers:{Accept:'application/vnd.github+json'},credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(8000)});
   if(!response.ok)throw new Error('GitHub unavailable');
   const result=await response.json();
   if(!Number.isSafeInteger(result.stargazers_count)||result.stargazers_count<0)throw new Error('Invalid count');
   const value={count:result.stargazers_count,at:Date.now()};showStars(badge,value.count,value.at);
   try{localStorage.setItem('repo-stars:'+repo,JSON.stringify(value));}catch{}
  }catch{badge.hidden=true;}
 }));}finally{updatingStars=false;}
}
refreshStars();
setInterval(refreshStars,starCacheTTL);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshStars();});
