const $=s=>document.querySelector(s);
const rp=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n||0);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='catatan-v1';
const seed=()=>({nid:6,hoff:0,cats:['Minuman','Aksesori','Alat Tulis','Makanan'],products:[
{id:1,name:'Kopi Arabika Gayo 250 g',cat:'Minuman',price:85000,cost:62000,stock:24,note:'Kemasan zip, tahan 8 bulan',img:''},
{id:2,name:'Teh Melati Premium 100 g',cat:'Minuman',price:42000,cost:29000,stock:30,note:'',img:''},
{id:3,name:'Tumbler Stainless 500 ml',cat:'Aksesori',price:129000,cost:90000,stock:4,note:'Sisa warna hitam saja',img:''},
{id:4,name:'Buku Catatan A5',cat:'Alat Tulis',price:35000,cost:21000,stock:40,note:'',img:''},
{id:5,name:'Keripik Tempe Pedas',cat:'Makanan',price:22000,cost:14000,stock:0,note:'Menunggu kiriman supplier',img:''}]});
function load(){
try{const a=JSON.parse(localStorage.getItem(KEY));if(a&&Array.isArray(a.products)&&Array.isArray(a.cats))return a}catch(e){}
try{const o=JSON.parse(localStorage.getItem('fissa-v1'));if(o&&Array.isArray(o.products))return{nid:o.nid||100,hoff:0,cats:o.cats||[],products:o.products.map(p=>({cost:0,note:'',...p}))}}catch(e){}
return seed()}
let S=load();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){return false}};
let ui={q:'',cat:'Semua',sort:'new'},fImg='';
const pr=id=>S.products.find(p=>p.id==id);
const dlg=$('#dlg');
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2400)};
const hue=p=>(p.id*47)%360;
const ph=p=>p.img?`<img src="${p.img}" alt="${esc(p.name)}">`:`<span>${esc(p.name.trim().charAt(0).toUpperCase())}</span>`;
function shrink(file,max,q){return new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',q))};im.onerror=no;im.src=r.result};r.onerror=no;r.readAsDataURL(file)})}
/* Jam, hari, dan tanggal hijriah */
function hijri(d){try{const x=new Date(d.getTime()+(S.hoff||0)*864e5);const p=new Intl.DateTimeFormat('id-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).formatToParts(x);const g=t=>(p.find(i=>i.type===t)||{}).value;return g('day')+' '+g('month')+' '+g('year')+' H'}catch(e){return 'Tanggal hijriah tidak tersedia'}}
function tick(){
const d=new Date(),h=d.getHours(),z=-d.getTimezoneOffset()/60,p=n=>String(n).padStart(2,'0');
$('#hm').textContent=p(h)+':'+p(d.getMinutes());$('#ss').textContent=p(d.getSeconds());
$('#gr').textContent=h<4?'Selamat malam':h<11?'Selamat pagi':h<15?'Selamat siang':h<18?'Selamat sore':'Selamat malam';
$('#tz').textContent=({7:'WIB',8:'WITA',9:'WIT'}[z])||('GMT'+(z>=0?'+':'')+z);
$('#wd').textContent=d.toLocaleDateString('id-ID',{weekday:'long'});
$('#gd').textContent=d.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
$('#hj').textContent=hijri(d);
document.querySelectorAll('.hoff button').forEach(b=>b.classList.toggle('on',+b.dataset.id===(S.hoff||0)))}
/* Daftar produk */
const row=p=>`<article class="pc"><div class="th" style="--h:${hue(p)}">${ph(p)}</div><div class="inf"><h3>${esc(p.name)}</h3><span class="tag">${esc(p.cat)}</span>${p.stock<1?'<span class="bd out">Habis</span>':p.stock<=5?'<span class="bd low">Menipis</span>':''}${p.note?`<p class="nt">${esc(p.note)}</p>`:''}</div><div class="pp"><b>${rp(p.price)}</b>${p.cost?`<small>Modal ${rp(p.cost)}</small>`:''}</div><div class="st"><button data-act="stm" data-id="${p.id}" aria-label="Kurangi stok">−</button><b>${p.stock}</b><button data-act="stp" data-id="${p.id}" aria-label="Tambah stok">+</button></div><div class="ac"><button class="btn sm" data-act="edit" data-id="${p.id}">Edit</button><button class="btn sm dg" data-act="del" data-id="${p.id}">Hapus</button></div></article>`;
const list=()=>{
const q=ui.q.toLowerCase();
const l=S.products.filter(p=>(ui.cat==='Semua'||p.cat===ui.cat)&&(p.name+' '+(p.note||'')).toLowerCase().includes(q));
l.sort({new:(a,b)=>b.id-a.id,name:(a,b)=>a.name.localeCompare(b.name),stock:(a,b)=>a.stock-b.stock,price:(a,b)=>b.price-a.price}[ui.sort]);
return l.map(row).join('')||`<div class="empty">${S.products.length?'Tidak ada produk yang cocok. Ubah kata kunci atau pilih kategori Semua.':'Belum ada produk. Klik Tambah produk untuk mencatat produk pertama Anda.'}</div>`};
function render(){
const P=S.products,low=P.filter(p=>p.stock<=5).length;
if(ui.cat!=='Semua'&&!S.cats.includes(ui.cat))ui.cat='Semua';
const st=[['Jumlah produk',P.length,''],['Total stok',P.reduce((a,p)=>a+p.stock,0),''],['Nilai stok (harga jual)',rp(P.reduce((a,p)=>a+p.price*p.stock,0)),''],['Stok menipis atau habis',low,low?'w':'']];
$('#app').innerHTML=`<div class="stats">${st.map(([a,b,c])=>`<div class="stat ${c}"><span>${a}</span><b>${b}</b></div>`).join('')}</div>
<div class="tool"><input id="q" type="search" placeholder="Cari nama atau catatan produk" aria-label="Cari produk" value="${esc(ui.q)}">
<select id="fc" aria-label="Filter kategori">${['Semua',...S.cats].map(c=>`<option ${c===ui.cat?'selected':''}>${esc(c)}</option>`).join('')}</select>
<select id="so" aria-label="Urutkan">${[['new','Terbaru'],['name','Nama A–Z'],['stock','Stok tersedikit'],['price','Harga tertinggi']].map(([v,t])=>`<option value="${v}" ${v===ui.sort?'selected':''}>${t}</option>`).join('')}</select>
<button class="btn" data-act="cats">Kelola kategori</button></div>
<div class="list" id="list">${list()}</div>
<p class="foot"><button class="btn sm dg" data-act="reset">Hapus semua produk</button></p>`}
function form(id){
if(!S.cats.length){toast('Tambahkan kategori dulu');return catDlg()}
const p=id?pr(id):{name:'',cat:S.cats[0],price:'',cost:'',stock:'',note:'',img:''};fImg=p.img||'';
dlg.innerHTML=`<form data-id="${id||''}"><h2>${id?'Edit produk':'Tambah produk'}</h2>
<div class="pv" id="pv"></div>
<div class="bn"><label class="btn">Pilih gambar produk<input id="pf" type="file" accept="image/*" hidden></label><button type="button" class="btn" data-act="rmimg">Hapus gambar</button></div>
<label>Nama produk<input name="name" required value="${esc(p.name)}"></label>
<label>Kategori<select name="cat">${S.cats.map(c=>`<option ${c===p.cat?'selected':''}>${esc(c)}</option>`).join('')}</select></label>
<div class="two"><label>Harga jual (Rp)<input name="price" type="number" min="0" required value="${p.price}"></label><label>Stok<input name="stock" type="number" min="0" required value="${p.stock}"></label></div>
<label>Harga modal (Rp, boleh dikosongkan)<input name="cost" type="number" min="0" value="${p.cost||''}"></label>
<label>Catatan<textarea name="note" placeholder="Contoh: supplier, ukuran, warna">${esc(p.note||'')}</textarea></label>
<div class="acts"><button type="button" class="btn" data-act="closed">Batal</button><button class="btn pri">Simpan produk</button></div></form>`;dlg.showModal();pv()}
function pv(){$('#pv').innerHTML=fImg?`<img src="${fImg}" alt="Pratinjau">`:'<small>Belum ada gambar</small>'}
function catDlg(){
dlg.innerHTML=`<h2>Kelola kategori</h2><div class="cats">${S.cats.map(k=>`<div class="crow"><input data-cat="${esc(k)}" value="${esc(k)}" aria-label="Nama kategori ${esc(k)}"><small>${S.products.filter(p=>p.cat===k).length} produk</small><button class="btn sm dg" data-act="delcat" data-id="${esc(k)}">Hapus</button></div>`).join('')||'<p class="empty">Belum ada kategori. Tambahkan di bawah.</p>'}</div>
<div class="crow"><input id="nc" placeholder="Nama kategori baru" aria-label="Nama kategori baru"><button class="btn sm pri" data-act="addcat">Tambah</button></div>
<p><small>Ubah nama langsung di kolom, lalu tekan Enter.</small></p><div class="acts"><button class="btn pri" data-act="closed">Selesai</button></div>`;if(!dlg.open)dlg.showModal()}
const ask=(t,m,b,act,id)=>{dlg.innerHTML=`<h2>${t}</h2><p>${m}</p><div class="acts"><button class="btn" data-act="closed">Batal</button><button class="btn pri" data-act="${act}" data-id="${id||''}">${b}</button></div>`;dlg.showModal()};
const A={
new(){form()},edit(id){form(id)},closed(){dlg.close()},
rmimg(){fImg='';pv()},
stp(id){pr(id).stock++;save();render()},
stm(id){const p=pr(id);if(p.stock>0)p.stock--;save();render()},
del(id){ask('Hapus produk?',esc(pr(id).name)+' akan dihapus dari catatan dan tidak bisa dikembalikan.','Hapus produk','delok',id)},
delok(id){S.products=S.products.filter(p=>p.id!=id);save();dlg.close();toast('Produk dihapus')},
reset(){ask('Hapus semua produk?','Seluruh catatan produk akan dikosongkan. Kategori tetap disimpan.','Hapus semua','resetok')},
resetok(){S.products=[];save();dlg.close();toast('Catatan dikosongkan')},
cats(){catDlg()},
addcat(){const v=$('#nc').value.trim();if(!v)return toast('Isi nama kategori dulu');if(S.cats.includes(v))return toast('Kategori sudah ada');S.cats.push(v);save();catDlg();toast('Kategori ditambahkan')},
delcat(id){if(S.products.some(p=>p.cat===id))return toast('Masih ada produk di kategori ini. Pindahkan atau hapus dulu.');S.cats=S.cats.filter(c=>c!==id);save();catDlg();toast('Kategori dihapus')},
hoff(id){S.hoff=+id;save();tick()}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const f=A[b.dataset.act];if(f)f(b.dataset.id)});
document.addEventListener('change',async e=>{const t=e.target;
if(t.id==='fc'){ui.cat=t.value;$('#list').innerHTML=list()}
else if(t.id==='so'){ui.sort=t.value;$('#list').innerHTML=list()}
else if(t.dataset.cat!==undefined){const old=t.dataset.cat,v=t.value.trim();if(!v||v===old)return catDlg();if(S.cats.includes(v)){toast('Kategori sudah ada');return catDlg()}S.cats=S.cats.map(c=>c===old?v:c);S.products.forEach(p=>{if(p.cat===old)p.cat=v});if(ui.cat===old)ui.cat=v;save();catDlg();toast('Nama kategori diubah')}
else if(t.id==='pf'&&t.files[0]){try{fImg=await shrink(t.files[0],640,.82);pv()}catch(err){toast('Gambar tidak bisa dibaca. Pilih file JPG atau PNG.')}}});
document.addEventListener('input',e=>{if(e.target.id==='q'){ui.q=e.target.value;$('#list').innerHTML=list()}});
document.addEventListener('submit',e=>{
e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f)),id=f.dataset.id;
const v={name:d.name.trim(),cat:d.cat,price:Math.max(0,+d.price||0),cost:Math.max(0,+d.cost||0),stock:Math.max(0,Math.floor(+d.stock||0)),note:d.note.trim(),img:fImg};
if(id)Object.assign(pr(id),v);else S.products.push({id:S.nid++,...v});
const ok=save();dlg.close();toast(ok?(id?'Perubahan disimpan':'Produk dicatat'):'Penyimpanan penuh. Gunakan gambar yang lebih kecil.')});
dlg.addEventListener('close',render);
render();tick();setInterval(tick,1000);
