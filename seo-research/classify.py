import json,re
R=json.load(open('kp_merged.json'))
EXC=re.compile(r"\b(job|jobs|hiring|career|salary|near me|amazon warehouse (near|jobs)|walmart warehouse|storage unit|self storage|public storage|cubesmart|extra space|u-?haul|mini storage|login|log in|stock price|stock|careers|employee|apply|indeed|wage|pay rate|part time|shift|osha|for sale|lease|rent(al)?|for rent|software|wms|erp|app\b|course|certification|degree|salaries|ups store|usps|fedex office|clothing|game|minecraft|meaning in|in hindi|in urdu|pdf|ppt|mba)\b",re.I)
THEMES=[
 ('amazon-fba-prep', r"fba|fnsku|amazon prep|prep center|prep service|amazon (inventory|seller).*(storage|warehouse|prep)|replenish"),
 ('subscription-fulfillment', r"subscription"),
 ('kitting', r"kitting|kit assembly|bundl|co.?pack|contract packag|assembly service|light assembly|product assembly"),
 ('cross-docking', r"cross.?dock|transload|container unload|devann"),
 ('returns-management', r"return(s)? (management|processing|fulfillment|3pl|warehouse|logistics|center)|rma|ecommerce returns"),
 ('reverse-logistics', r"reverse logistic|liquidation|refurbish"),
 ('pick-and-pack', r"pick.{0,5}pack|order picking|picking and packing"),
 ('retail-fulfillment', r"retail|edi|walmart (supplier|fulfillment services|marketplace)|store replenish|big box"),
 ('b2b-fulfillment', r"b2b|wholesale|distribution service|distributor|pallet fulfill"),
 ('inventory-storage', r"inventory (storage|warehouse)|overflow|product storage|bulk storage|pallet storage|storage (service|solution|warehouse)"),
 ('warehousing', r"warehous"),
 ('ecommerce-fulfillment', r"ecommerce|e-commerce|shopify|dtc|d2c|online store|order fulfillment|multi.?channel|omnichannel"),
 ('homepage', r"3pl|3 pl|third.?party (logistics|fulfillment|warehous)|3rd party|fulfillment (center|company|companies|service|warehouse|provider)"),
]
INFO=re.compile(r"^(what|how|why|when|is|are|does|can|should)\b|\b(vs|versus|meaning|definition|examples?|cost|pricing|price|rates|explained|guide)\b",re.I)
COMP=re.compile(r"\b(best|top|alternative|alternatives|compare|comparison|review|reviews)\b|shipbob|shipmonk|flowspace|stord|red stag|deliverr|dcl|ryder|saddle creek|amz ?prep|prep ?prime|flexport",re.I)
out=[]
for r in R:
    k=r['keyword']
    if EXC.search(k): r['relevant']=False; out.append(r); continue
    th=next((t for t,p in THEMES if re.search(p,k,re.I)),None)
    r['relevant']= th is not None
    r['theme']=th or ''
    r['intent']='Comparison' if COMP.search(k) else ('Informational' if INFO.search(k) else 'Commercial/Transactional')
    out.append(r)
json.dump(out,open('kp_classified.json','w'))
rel=[r for r in out if r.get('relevant')]
print(len(rel))
import collections
by=collections.defaultdict(list)
for r in rel: by[r['theme']].append(r)
for t,_ in THEMES:
    L=sorted(by[t],key=lambda x:-x['vol'])[:22]
    print('\n##',t,len(by[t]))
    print('; '.join(f"{x['keyword']}={x['vol']}/{x['comp'][:1]}/{x['low']}-{x['high']}" for x in L))
