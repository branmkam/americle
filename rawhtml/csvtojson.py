import pandas as pd
df = pd.read_csv (r'uscities.csv')
df.to_json(r'uscities.json')