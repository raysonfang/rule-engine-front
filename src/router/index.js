import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/Home'

import Condition from '@/components/basic/Condition'
import Element from '@/components/basic/Element.vue'
import Function from '@/components/basic/Function.vue'
import Variable from '@/components/basic/Variable.vue'

import Rule from '@/components/rule/Rule.vue'
import RuleConfig from '@/components/rule/RuleConfig.vue'
import RuleViewAndTest from '@/components/rule/RuleViewAndTest.vue'
import RuleDefinition from '@/components/rule/RuleDefinition.vue'

import SystemSetting from '@/components/setting/SystemSetting.vue'

import ScoreCard from '@/components/score/ScoreCard.vue'

import DecisionTree from '@/components/decision/tree/DecisionTree'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/condition',
          name: 'Condition',
          component: Condition
        },
        {
          path: '/element',
          name: 'Element',
          component: Element
        },
        {
          path: '/function',
          name: 'Function',
          component: Function
        },
        {
          path: '/variable',
          name: 'Variable',
          component: Variable
        },
        {
          path: '/rule',
          name: 'Rule',
          component: Rule
        },
        {
          path: '/ruleConfig',
          name: 'RuleConfig',
          component: RuleConfig
        },
        {
          path: '/ruleViewAndTest',
          name: 'RuleViewAndTest',
          component: RuleViewAndTest
        },
        {
          path: '/ruleDefinition',
          name: 'RuleDefinition',
          component: RuleDefinition
        },
        {
          path: '/systemSetting',
          name: 'SystemSetting',
          component: SystemSetting
        },
        {
          path: '/scoreCard',
          name: 'ScoreCard',
          component: ScoreCard
        },
        {
          path: '/decisionTree',
          name: 'DecisionTree',
          component: DecisionTree
        },
      ]
    }
  ]
})
