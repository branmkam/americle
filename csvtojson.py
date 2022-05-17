import pandas as pd
df = pd.read_csv (r'uscities-abr.csv')
df.to_json(r'uscities.json')