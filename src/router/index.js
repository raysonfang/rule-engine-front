import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/Home'

import Login from '@/components/Login.vue'
import Page500 from '@/components/500.vue'
import Page404 from '@/components/404.vue'

import Condition from '@/components/basic/Condition'
import Element from '@/components/basic/Element.vue'
import Function from '@/components/basic/Function.vue'
import Variable from '@/components/basic/Variable.vue'

import Rule from '@/components/rule/Rule.vue'
import RuleConfig from '@/components/rule/RuleConfig.vue'
import RuleViewAndTest from '@/components/rule/RuleViewAndTest.vue'
import RuleViewPublish from '@/components/rule/RuleViewPublish.vue'
import RuleDefinition from '@/components/rule/RuleDefinition.vue'

import SystemSetting from '@/components/setting/SystemSetting.vue'
import PersonalSettings from '@/components/setting/PersonalSettings.vue'

import ScoreCard from '@/components/score/ScoreCard.vue'

import DecisionTree from '@/components/decision/tree/DecisionTree'
import DecisionTable from '@/components/decision/table/DecisionTable'

import Workspace from '@/components/authority/Workspace'

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
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
          path: '/ruleViewPublish',
          name: 'RuleViewPublish',
          component: RuleViewPublish
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
          path: '/personalSettings',
          name: 'PersonalSettings',
          component: PersonalSettings
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
        {
          path: '/decisionTable',
          name: 'DecisionTable',
          component: DecisionTable
        },
        {
          path: '/workspace',
          name: 'Workspace',
          component: Workspace
        },
      ]
    },
    {
      path: '/500',
      name: 'Page500',
      component: Page500,
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404
    }
  ]
})
