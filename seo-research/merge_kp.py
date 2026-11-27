import csv, glob, os, re, json
rows={}
for f in sorted(glob.glob('kp-exports/kp-*.csv')):
    grp=os.path.basename(f)[3:-4]
    with open(f,encoding='utf-8') as fh:
        r=list(csv.reader(fh))
    hdr=r[2]
    for line in r[3:]:
        if not line or not line[0]: continue
        d=dict(zip(hdr,line))
        k=d['Keyword'].strip().lower()
        try: vol=int(float(d['Avg. monthly searches'] or 0))
        except: vol=0
        months=[d.get(h,'') for h in hdr if h.startswith('Searches:')]
        rec=rows.get(k)
        if rec: rec['groups'].add(grp); continue
        rows[k]=dict(keyword=k,vol=vol,m3=d['Three month change'],yoy=d['YoY change'],comp=d['Competition'],
                     compidx=d['Competition (indexed value)'],low=d['Top of page bid (low range)'],high=d['Top of page bid (high range)'],
                     months='|'.join(months),groups={grp})
for r in rows.values(): r['groups']=';'.join(sorted(r['groups']))
json.dump(list(rows.values()),open('kp_merged.json','w'))
print(len(rows))
