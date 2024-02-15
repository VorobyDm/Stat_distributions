from pathlib import Path
import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pylab as plt
import math

DATA_PATH = Path().resolve()

# Define paths to data sets. If you don't keep your data in the same directory as the code, adapt the path names.

DATA_CSV = DATA_PATH / 'data.csv'
BINS = 100

## Sampling Distribution of a Statistic

raw_data = pd.read_csv(DATA_CSV).squeeze('columns')

intervals = pd.interval_range(0, raw_data.max(), BINS)

print(intervals)

mean = raw_data.mean()
std = raw_data.std()

se_05 = std / math.sqrt(5)
se_20 = std / math.sqrt(20)

print("mean (μ): ", mean)
print("std (σ): ", std)

# print("std 5: ", sample_mean_05["income"].std())
# print("std 20: ", sample_mean_20["income"].std())

fig, axes = plt.subplots(figsize=(14, 5), ncols=2, nrows=3)

####### [0,0] #######
N00, bins00, patches00 = axes[0,0].hist(
    raw_data,
    bins = BINS,
    density=True,
    rwidth=0.8, 
)

####### [1,0] #######
N10, bins10, patches10 = axes[1,0].hist(
    raw_data,
    bins = BINS,
    density=True,
    rwidth=0.8, 
)

####### [0,1] #######
line05, = axes[0,1].plot([], color='r') 
# Set the x-axis and y-axis limits to 100 
axes[0,1].set_xlim(0, 1000) 
axes[0,1].set_ylim(0, raw_data.max()) 

text05 = axes[0,1].text(5, 4*raw_data.max()/5, f'')

####### [1,1] #######
line20, = axes[1,1].plot([], color='g') 
# Set the x-axis and y-axis limits to 100 
axes[1,1].set_xlim(0, 1000) 
axes[1,1].set_ylim(0, raw_data.max()) 

text20 = axes[1,1].text(5, 3*raw_data.max()/5, f'')

sample_mean_05 = pd.DataFrame(columns = ['mean_05'])
sample_mean_20 = pd.DataFrame(columns = ['mean_20'])

X_05 = np.linspace(math.floor(mean - 4*se_05), math.ceil(mean + 4*se_05), 400)
# https://proclusacademy.com/blog/practical/normal-distribution-python-scipy/
# https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html
PDF_05 = stats.norm(loc=mean, scale=se_05).pdf(X_05)

X_20 = np.linspace(math.floor(mean - 4*se_20), math.ceil(mean + 4*se_20), 400)
# https://proclusacademy.com/blog/practical/normal-distribution-python-scipy/
# https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html
PDF_20 = stats.norm(loc=mean, scale=se_20).pdf(X_20)

Z_X = np.linspace(-4, 4, 400)
# https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html
Z_PDF = stats.norm(loc=0, scale=1).pdf(Z_X)

# https://www.geeksforgeeks.org/dynamic-visualization-using-python/
for i in range(1000): 
    sample_05 = raw_data.sample(5)
    sample_20 = raw_data.sample(20)

    bins = [intervals.get_loc(value) for value in sample_05.values]
    for j in range(len(patches00)):
        patches00[j].set_facecolor('r' if j in bins else 'b')

    bins = [intervals.get_loc(value) for value in sample_20.values]
    for j in range(len(patches10)):
        patches10[j].set_facecolor('g' if j in bins else 'b')

    # https://stackoverflow.com/questions/39223286/how-to-refresh-text-in-matplotlib
    text05.set_text(f'Sample {i}: {str(sample_05.values)}\nSample mean (x̄): {sample_05.mean()}')
    text20.set_text(f'Sample {i}: {str(sample_20.values)}\nSample mean (x̄): {sample_20.mean()}')
    # https://www.geeksforgeeks.org/how-to-add-one-row-in-an-existing-pandas-dataframe/

    sample_mean_05.loc[i] = [sample_05.mean()]
    line05.set_data(sample_mean_05.index.values, sample_mean_05['mean_05'].values)

    sample_mean_20.loc[i] = [sample_20.mean()]
    line20.set_data(sample_mean_20.index.values, sample_mean_20['mean_20'].values)

    z_sample_mean_05 = (sample_mean_05['mean_05'] - mean) / se_05
    z_sample_mean_20 = (sample_mean_20['mean_20'] - mean) / se_20

    if (i < 100) or (i == 999):
        ####### [2,0] #######
        axes[2,0].cla()
        axes[2,0].hist(sample_mean_05['mean_05'].values, bins = BINS, density=True, rwidth=0.8, alpha=0.8, color='r')
        axes[2,0].hist(sample_mean_20['mean_20'].values, bins = BINS, density=True, rwidth=0.8, alpha=0.8, color='g')
        axes[2,0].plot(X_05, PDF_05, alpha=1.0, color='black', linewidth=3.0)
        axes[2,0].plot(X_20, PDF_20, alpha=1.0, color='black', linewidth=3.0)

        ####### [2,1] #######
        axes[2,1].cla()
        axes[2,1].hist(z_sample_mean_05.values, bins = BINS, density=True, rwidth=0.8, alpha=0.8, color='r')
        axes[2,1].hist(z_sample_mean_20.values, bins = BINS, density=True, rwidth=0.8, alpha=0.8, color='g')
        axes[2,1].plot(Z_X, Z_PDF, alpha=1.0, color='black', linewidth=3.0)
        
        (i % 20 == 0) and plt.tight_layout()

    # pause the plot for 0.01s before next point is shown 
    # plt.pause(0.5 if i < 100 else 0.0001) 
    (i < 100) and plt.pause(0.05)

print("end")

plt.show()

