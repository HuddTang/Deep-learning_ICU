import tensorflow as tf
import numpy as np
import csv
from data_pre import *
#import vision
import copy
import json
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from lifelines.utils import concordance_index
from supersmoother import SuperSmoother
import scipy.linalg as sl

class snn(object):
    def __init__(self, input_node, input_layers_node, hidden_layers_node, output_node,
                 learning_rate=0.001, learning_rate_decay=1.0, activation='tanh',
                 L2_reg=0.0, L1_reg=0.0, optimizer='sgd', dropout_keep_prob=1.0, ties='noties'):

        self.train_data = dict()
        self.split_cut = []
        self.train_data['ties'] = ties
        self.configuration = {
            'input_node': input_node,
            'input_layers_node': input_layers_node,
            'hidden_layers_node': hidden_layers_node,
            'output_node': output_node,
            'learning_rate': learning_rate,
            'learning_rate_decay': learning_rate_decay,
            'activation': activation,
            'L1_reg': L1_reg,
            'L2_reg': L2_reg,
            'optimizer': optimizer,
            'dropout': dropout_keep_prob
        }

    def load_data(self,X,label):
        self.train_data['X'], self.train_data['E'], \
            self.train_data['T'], self.train_data['failures'], \
            self.train_data['atrisk'], self.train_data['ties'] = parse_data(X, label)
        print('pre success')

    def load_split(self, cut):
        self.split_cut = cut

    def generate_graph(self,seed=1):
        G = tf.Graph()
        with G.as_default():
            tf.set_random_seed(seed)

            X = tf.placeholder(tf.float32, [None, self.configuration['input_node']], name = 'x-input')
            y_ = tf.placeholder(tf.float32, [None, self.configuration['output_node']], name = 'label-input')

            keep_prob = tf.placeholder(tf.float32)

            self.firstweights = []
            self.nnweights = []
            self.nnbias = []
            prev_node = self.configuration['input_node']
            input_x = []
            for i in range(len(self.split_cut)-1):
                input_x.append(X[:, self.split_cut[i]:self.split_cut[i+1]])
            prev_x = None
            for i in range(len(input_x)):
                layer_name = 'layer_input' + str(i + 1)
                with tf.variable_scope(layer_name, reuse=tf.AUTO_REUSE):

                    weights = tf.get_variable('weights', [self.split_cut[i+1]-self.split_cut[i], self.configuration['input_layers_node'][i]],initializer=tf.truncated_normal_initializer(stddev=0.1))
                    self.firstweights.append(weights)
                    biases = tf.get_variable('biases', [self.configuration['input_layers_node'][i]],initializer=tf.constant_initializer(0.0))
                    # self.nnbias.append(biases)
                    layer_out = tf.nn.dropout(tf.matmul(input_x[i], weights) + biases, keep_prob)

                    if self.configuration['activation'] == 'relu':
                        layer_out = tf.nn.relu(layer_out)
                    elif self.configuration['activation'] == 'sigmoid':
                        layer_out = tf.nn.sigmoid(layer_out)
                    elif self.configuration['activation'] == 'tanh':
                        layer_out = tf.nn.tanh(layer_out)
                    else:
                        raise NotImplementedError('activation not recognized')
                    if prev_x is None:
                        prev_x = layer_out
                    else:
                        prev_x = tf.concat([prev_x, layer_out], axis=1)
            prev_node = sum(self.configuration['input_layers_node'])
            for i in range(len(self.configuration['hidden_layers_node'])):
                layer_name = 'layer' + str(i+1)
                with tf.variable_scope(layer_name, reuse=tf.AUTO_REUSE):
                    weights = tf.get_variable('weights',[prev_node,self.configuration['hidden_layers_node'][i]],initializer=tf.truncated_normal_initializer(stddev=0.1))
                    self.nnweights.append(weights)

                    biases = tf.get_variable('biases',[self.configuration['hidden_layers_node'][i]],initializer=tf.constant_initializer(0.0))
                    self.nnbias.append(biases)
                    layer_out = tf.nn.dropout(tf.matmul(prev_x,weights)+biases, keep_prob)

                    if self.configuration['activation'] == 'relu':
                        layer_out = tf.nn.relu(layer_out)
                    elif self.configuration['activation'] == 'sigmoid':
                        layer_out = tf.nn.sigmoid(layer_out)
                    elif self.configuration['activation'] == 'tanh':
                        layer_out = tf.nn.tanh(layer_out)
                    else:
                        raise NotImplementedError('activation not recognized')

                    prev_node = self.configuration['hidden_layers_node'][i]
                    prev_x = layer_out

            layer_name = 'layer_last'
            with tf.variable_scope(layer_name, reuse=tf.AUTO_REUSE):
                weights = tf.get_variable('weights',[prev_node,self.configuration['output_node']],initializer=tf.truncated_normal_initializer(stddev=0.1))
                self.nnweights.append(weights)
                biases = tf.get_variable('biases',[self.configuration['output_node']],initializer=tf.constant_initializer(0.0))
                self.nnbias.append(biases)

                layer_out = tf.matmul(prev_x,weights)+biases

            y = layer_out
            # Global step
            with tf.variable_scope('training_step', reuse=tf.AUTO_REUSE):
                global_step = tf.get_variable(
                    "global_step",
                    [],
                    dtype=tf.int32,
                    initializer=tf.constant_initializer(0),
                    trainable=False
                )
            # Loss value
            reg_item = tf.contrib.layers.l1_l2_regularizer(self.configuration['L1_reg'], self.configuration['L2_reg'])
            reg_term = tf.contrib.layers.apply_regularization(reg_item, self.nnweights)
            loss_fun = self._negative_log_likelihood(y_, y)
            loss = loss_fun + reg_term

            if self.configuration['optimizer'] == 'sgd':
                lr = tf.train.exponential_decay(self.configuration['learning_rate'],global_step,1,self.configuration['learning_rate_decay'])
                train_step = tf.train.GradientDescentOptimizer(lr).minimize(loss, global_step=global_step)
            elif self.configuration['optimizer'] == 'adam':
                train_step = tf.train.AdamOptimizer(self.configuration['learning_rate']).minimize(loss, global_step=global_step)
            else:
                raise NotImplementedError('optimization not recognized')

            init_op = tf.global_variables_initializer()
            saver = tf.train.Saver(max_to_keep=1)

        print('graph success')
        self.X = X
        print('X')
        self.y_ = y_
        print('y_')
        self.keep_prob = keep_prob
        print('keep_prob')
        self.y = y
        print(y)
        print('y')
        self.global_step = global_step
        self.loss = loss
        print(loss)
        print('loss')
        self.train_step = train_step

        self.saver = saver
        print('before_sess')

        self.sess = tf.Session(graph=G)
        self.sess.run(init_op)

        print('before_sess_run')
        # self.sess.run(init_op)

    def load_model(self):
        G = tf.Graph()
        with G.as_default():
            tf.set_random_seed(1)

            X = tf.placeholder(tf.float32, [None, self.configuration['input_node']], name='x-input')
            y_ = tf.placeholder(tf.float32, [None, self.configuration['output_node']], name='label-input')

            keep_prob = tf.placeholder(tf.float32)

            self.firstweights = []
            self.nnweights = []
            self.nnbias = []
            prev_node = self.configuration['input_node']
            input_x = []
            for i in range(len(self.split_cut) - 1):
                input_x.append(X[:, self.split_cut[i]:self.split_cut[i + 1]])
            prev_x = None
            for i in range(len(input_x)):
                layer_name = 'layer_input' + str(i + 1)
                with tf.variable_scope(layer_name, reuse=tf.AUTO_REUSE):

                    weights = tf.get_variable('weights', [self.split_cut[i + 1] - self.split_cut[i],
                                                          self.configuration['input_layers_node'][i]],
                                              initializer=tf.truncated_normal_initializer(stddev=0.1))
                    self.firstweights.append(weights)
                    biases = tf.get_variable('biases', [self.configuration['input_layers_node'][i]],
                                             initializer=tf.constant_initializer(0.0))
                    # self.nnbias.append(biases)
                    # layer_out = tf.nn.dropout(tf.matmul(input_x[i], weights) + biases, keep_prob)
                    layer_out = tf.matmul(input_x[i], weights) + biases

                    if self.configuration['activation'] == 'relu':
                        layer_out = tf.nn.relu(layer_out)
                    elif self.configuration['activation'] == 'sigmoid':
                        layer_out = tf.nn.sigmoid(layer_out)
                    elif self.configuration['activation'] == 'tanh':
                        layer_out = tf.nn.tanh(layer_out)
                    else:
                        raise NotImplementedError('activation not recognized')
                    if prev_x is None:
                        prev_x = layer_out
                    else:
                        prev_x = tf.concat([prev_x, layer_out], axis=1)
            prev_node = sum(self.configuration['input_layers_node'])
            for i in range(len(self.configuration['hidden_layers_node'])):
                layer_name = 'layer' + str(i + 1)
                with tf.variable_scope(layer_name, reuse=tf.AUTO_REUSE):
                    weights = tf.get_variable('weights', [prev_node, self.configuration['hidden_layers_node'][i]],
                                              initializer=tf.truncated_normal_initializer(stddev=0.1))
                    self.nnweights.append(weights)

                    biases = tf.get_variable('biases', [self.configuration['hidden_layers_node'][i]],
                                             initializer=tf.constant_initializer(0.0))
                    self.nnbias.append(biases)
                    # layer_out = tf.nn.dropout(tf.matmul(prev_x, weights) + biases, keep_prob)
                    layer_out = tf.matmul(prev_x, weights) + biases
                    if self.configuration['activation'] == 'relu':
                        layer_out = tf.nn.relu(layer_out)
                    elif self.configuration['activation'] == 'sigmoid':
                        layer_out = tf.nn.sigmoid(layer_out)
                    elif self.configuration['activation'] == 'tanh':
                        layer_out = tf.nn.tanh(layer_out)
                    else:
                        raise NotImplementedError('activation not recognized')

                    prev_node = self.configuration['hidden_layers_node'][i]
                    prev_x = layer_out

            layer_name = 'layer_last'
            with tf.variable_scope(layer_name, reuse=tf.AUTO_REUSE):
                weights = tf.get_variable('weights', [prev_node, self.configuration['output_node']],
                                          initializer=tf.truncated_normal_initializer(stddev=0.1))
                self.nnweights.append(weights)
                biases = tf.get_variable('biases', [self.configuration['output_node']],
                                         initializer=tf.constant_initializer(0.0))
                self.nnbias.append(biases)

                layer_out = tf.matmul(prev_x, weights) + biases

            y = layer_out

            saver = tf.train.Saver()

        # print('graph success')
        self.X = X
        self.y_ = y_
        self.keep_prob = keep_prob
        self.y = y

        self.sess = tf.Session(graph=G)
        saver.restore(self.sess, "./model_expand_muli_three_relu_0.0005/my-model-999")

    def train(self, X_test, y_test, X_valid, y_valid, num_epoch = 5000, iteration=-1):
        loss_list = []
        CI_list = []
        N = self.train_data['E'].shape[0]
        best_CI = 0
        best_V_CI = 0
        for i in range(num_epoch):
            print('epoch'+str(i))
            _, output_y, loss_value, step = self.sess.run(
                    [self.train_step, self.y, self.loss, self.global_step],
                    feed_dict= {
                        self.X: self.train_data['X'],
                        self.y_: self.train_data['E'].reshape((N,1)),
                        self.keep_prob: self.configuration['dropout']
                    }
                )
            loss_list.append(loss_value)
            label = {
                't': self.train_data['T'],
                'e': self.train_data['E']
            }
            CI = self._metrics_ci(label, output_y)
            CI_list.append(CI)

            test_CI = self.score(X_test, y_test)

            valid_CI = self.score(X_valid, y_valid)
            # T0, ST = model.survival_function(np.array(data),algo="wwe")
            # count = 0
            # for i in range(len(model.train_data['E'])):
            #     if (ST[i,np.where(T0==model.train_data['T'][i])] >= 0.5 and model.train_data['E'][i]>0) or (ST[i,np.where(T0==model.train_data['T'][i])] < 0.5 and model.train_data['E'][i]==0):
            #         count += 1
            # cur_value = count*1.0/len(model.train_data['E'])
            if (iteration != -1) and (i % iteration == 0):
                print("-------------------------------------------------")
                print("training steps %d:\nloss = %g.\n" % (step, loss_value))
                print("CI = %g.\n" % CI)
                print("test_CI = %g. \n" % test_CI)
                print("vaild_CI = %g. \n" % valid_CI)
                if test_CI >= best_CI:
                    best_CI = test_CI
                    self.saver.save(self.sess, "model_expand_muli_three_relu_0.0005/my-model", global_step=i)

    def _negative_log_likelihood(self, y_true, y_pred):
        logL = 0
        # pre-calculate cumsum
        cumsum_y_pred = tf.cumsum(y_pred)
        hazard_ratio = tf.exp(y_pred)
        cumsum_hazard_ratio = tf.cumsum(hazard_ratio)
        if self.train_data['ties'] == 'noties':
            log_risk = tf.log(cumsum_hazard_ratio)
            likelihood = y_pred - log_risk
            # dimension for E: np.array -> [None, 1]
            uncensored_likelihood = likelihood * y_true
            logL = -tf.reduce_sum(uncensored_likelihood)
        else:
            # Loop for death times
            for t in self.train_data['failures']:
                tfail = self.train_data['failures'][t]
                trisk = self.train_data['atrisk'][t]
                d = len(tfail)
                logL += -cumsum_y_pred[tfail[-1]] + (0 if tfail[0] == 0 else cumsum_y_pred[tfail[0]-1])

                if self.train_data['ties'] == 'breslow':
                    s = cumsum_hazard_ratio[trisk[-1]]
                    logL += tf.log(s) * d
                elif self.train_data['ties'] == 'efron':
                    s = cumsum_hazard_ratio[trisk[-1]]
                    r = cumsum_hazard_ratio[tfail[-1]] - (0 if tfail[0] == 0 else cumsum_hazard_ratio[tfail[0]-1])
                    for j in range(d):
                        logL += tf.log(s - j * r / d)
                else:
                    raise NotImplementedError('tie breaking method not recognized')
        # negative average log-likelihood
        observations = tf.reduce_sum(y_true)
        return logL / observations

    def _metrics_ci(self, label_true, y_pred):
        hr_pred = -y_pred
        ci = concordance_index(label_true['t'], hr_pred, label_true['e'])
        return ci

    def predict(self, X):

        risk = self.sess.run([self.y],feed_dict={self.X: X, self.keep_prob: 1.0})
        risk = np.squeeze(risk)
        if risk.shape == ():
            risk = risk.reshape((1, ))
        return risk
    def score(self,X,label):
        risk = self.predict(X)
        return self._metrics_ci(label,risk)
    def score_expand(self,X,label):
        risk = self.predict(X)
        return risk,self._metrics_ci(label,risk)
    def close(self):
        self.sess.close()
        print("session closed!")
    def get_vip_byweights(self):
        # Fetch weights of network
        w_firstL_list = [self.sess.run(w) for w in self.firstweights]
        W_firstL = sl.block_diag(*w_firstL_list)

        W = [self.sess.run(w) for w in self.nnweights]
        n_w = len(W)
        # Matrix multiplication for all hidden layers except last output layer
        hiddenMM = W[- 2].T
        for i in range(n_w - 3, -1, -1):
            hiddenMM = np.dot(hiddenMM, W[i].T)

        hiddenMM = np.dot(hiddenMM, W_firstL.T)

        # Multiply last layer matrix and compute the sum of each variable for VIP
        last_layer = W[-1]
        s = np.dot(np.diag(last_layer[:, 0]), hiddenMM)

        sumr = s / s.sum(axis=1).reshape(s.shape[0] ,1)
        score = sumr.sum(axis=0)
        VIP = score / score.max()
        for i, v in enumerate(VIP):
            print("%dth feature score : %g." % (i, v))
        return VIP

    def survival_function(self, X, algo="kp", base_X=None, base_label=None,
                          smoothed=False, is_plot=True):

        risk = self.predict(X)
        hazard_ratio = np.exp(risk.reshape((risk.shape[0], 1)))
        # Estimate S0(t) using data(base_X, base_label)
        T0, S0 = self.base_surv(algo=algo, X=base_X, label=base_label, smoothed=smoothed)
        ST = S0**(hazard_ratio)
        # if is_plot:
        #     vision.plot_surv_func(T0, ST)
        return T0, ST

    def base_surv(self, algo="wwe", X=None, label=None, smoothed=False):

        if X is None or label is None:
            X = self.train_data['X']
            label = {'t': self.train_data['T'],
                     'e': self.train_data['E']}
        X, E, T, failures, atrisk, ties = parse_data(X, label)

        s0 = [1]
        t0 = [0]
        risk = self.predict(X)
        hz_ratio = np.exp(risk)
        if algo == 'wwe':
            for t in T[::-1]:
                if t in t0:
                    continue
                t0.append(t)
                if t in atrisk:
                    # R(t_i) - D_i
                    trisk = [j for j in atrisk[t] if j not in failures[t]]
                    dt = len(failures[t]) * 1.0
                    s = np.sum(hz_ratio[trisk])
                    cj = 1 - dt / (dt + s)
                    s0.append(cj)
                else:
                    s0.append(1)
        elif algo == 'kp':
            for t in T[::-1]:
                if t in t0:
                    continue
                t0.append(t)
                if t in atrisk:
                    # R(t_i)
                    trisk = atrisk[t]
                    s = np.sum(hz_ratio[trisk])
                    si = hz_ratio[failures[t][0]]
                    cj = (1 - si / s) ** (1 / si)
                    s0.append(cj)
                else:
                    s0.append(1)
        elif algo == 'bsl':
            for t in T[::-1]:
                if t in t0:
                    continue
                t0.append(t)
                if t in atrisk:
                    # R(t_i)
                    trisk = atrisk[t]
                    dt = len(failures[t]) * 1.0
                    s = np.sum(hz_ratio[trisk])
                    cj = 1 - dt / s
                    s0.append(cj)
                else:
                    s0.append(1)
        else:
            raise NotImplementedError('tie breaking method not recognized')
        # base survival function
        S0 = np.cumprod(s0, axis=0)
        T0 = np.array(t0)

        if smoothed:
            # smooth the baseline hazard
            ss = SuperSmoother()
            #Check duplication points
            ss.fit(T0, S0, dy=100)
            S0 = ss.predict(T0)

        return T0, S0

#load data
def cur(info):
    data = []
    e = []
    t = []
    with open('./patient_train.npy','rb') as f:
        data = np.load(f)
        data = data[:,1:]

    with open('./label_train.npy','rb') as f:
        D = np.load(f)
        e = D[:,0]
        t = D[:,1]

    #
    # with open('./patient_outside.npy','rb') as f:
    #     data_valid = np.load(f)
    # with open('./label_outside.npy','rb') as f:
    #     D_valid = np.load(f)
    #     e_valid = D_valid[:,0]
    #     t_valid = D_valid[:,1]

    with open('./cut.json','r') as f:
        cut = json.load(f)
    print(len(data[0]))
    model = snn(len(data[0]),[12,30,39,27,12],[64,32,16],1, optimizer='adam')
    model.load_split(cut)
    print('split_input_success')
    model.load_model()
    T0, ST = model.survival_function(np.array(info),algo="kp",base_X=data, base_label={'e':e, 't':t})
    model.close()
    return [T0.tolist(),ST[0].tolist()]



