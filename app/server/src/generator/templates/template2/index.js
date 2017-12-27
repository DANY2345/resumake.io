/**
 * @flow
 */

import { stripIndent, source } from 'common-tags'
import { WHITESPACE } from '../constants'
import type { SanitizedValues } from '../../../types'

function template2({
  basics,
  education,
  work,
  projects,
  skills,
  awards
}: SanitizedValues) {
  return stripIndent`
    ${generateHeader()}
    \\begin{document}
    ${generateProfileSection(basics)}
    ${generateEducationSection(education)}
    ${generateExperienceSection(work)}
    ${generateSkillsSection(projects)}
    ${generateProjectsSection(skills)}
    ${generateAwardsSection(awards)}
    ${WHITESPACE}
    \\end{document}
  `
}

function generateProfileSection(basics) {
  if (!basics) {
    return ''
  }

  const { name, email, phone, location = {}, website } = basics

  let nameLine = ''

  if (name) {
    const names = name.split(' ')
    let nameStart = ''
    let nameEnd = ''

    if (names.length === 1) {
      nameStart = names[0]
    } else {
      nameStart = names[0]
      nameEnd = names.slice(1, names.length).join(' ')
    }

    nameLine = `\\headerfirstnamestyle{${nameStart}} \\headerlastnamestyle{${nameEnd}} \\\\`
  }

  const emailLine = email ? `{\\faEnvelope\\ ${email}}` : ''
  const phoneLine = phone ? `{\\faMobile\\ ${phone}}` : ''
  const addressLine = location.address
    ? `{\\faMapMarker\\ ${location.address}}`
    : ''
  const websiteLine = website ? `{\\faLink\\ ${website}}` : ''
  const info = [emailLine, phoneLine, addressLine, websiteLine]
    .filter(Boolean)
    .join(' | ')

  return stripIndent`
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    %     Profile
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    \\begin{center}
    ${nameLine}
    \\vspace{2mm}
    ${info}
    \\end{center}
  `
}

function generateEducationSection(education) {
  if (!education) {
    return ''
  }

  return source`
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %     Education
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \\cvsection{Education}
  \\begin{cventries}
  ${education.map(school => {
    const {
      institution,
      location,
      area,
      studyType,
      gpa,
      startDate,
      endDate
    } = school

    let degreeLine = ''

    if (studyType && area) {
      degreeLine = `${studyType} in ${area}`
    } else if (studyType || area) {
      degreeLine = studyType || area
    }

    let dateRange = ''

    if (startDate && endDate) {
      dateRange = `${startDate} – ${endDate}`
    } else if (startDate) {
      dateRange = `${startDate} – Present`
    } else {
      dateRange = endDate
    }

    return stripIndent`
      \\cventry
        {${degreeLine}}
        {${institution || ''}}
        {${location || ''}}
        {${dateRange}}
        {${gpa ? `GPA: ${gpa}` : ''}}
    `
  })}
  \\end{cventries}

  \\vspace{-2mm}
  `
}

function generateExperienceSection(work) {
  if (!work) {
    return ''
  }

  return source`
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %     Experience
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \\cvsection{Experience}
  \\begin{cventries}
  ${work.map(job => {
    const { company, position, location, startDate, endDate, highlights } = job

    let dateRange = ''
    let dutyLines = ''

    if (startDate && endDate) {
      dateRange = `${startDate} – ${endDate}`
    } else if (startDate) {
      dateRange = `${startDate} – Present`
    } else {
      dateRange = endDate
    }

    if (highlights) {
      dutyLines = source`
        \\begin{cvitems}
          ${highlights.map(duty => `\\item {${duty}}`)}
        \\end{cvitems}
        `
    }

    return stripIndent`
      \\cventry
        {${position || ''}}
        {${company || ''}}
        {${location || ''}}
        {${dateRange || ''}}
        {${dutyLines}}
    `
  })}
  \\end{cventries}
  `
}

function generateSkillsSection(skills) {
  if (!skills) {
    return ''
  }

  return source`
  \\cvsection{Skills}
  \\begin{cventries}
  \\cventry
  {}
  {\\def\\arraystretch{1.15}{\\begin{tabular}{ l l }
  ${skills.map(skill => {
    const { name, details } = skill
    const nameLine = name ? `${name}: ` : ''
    const detailsLine = `{\\skill{ ${details || ''}}}`

    return `${nameLine} & ${detailsLine} \\\\`
  })}
  \\end{tabular}}}
  {}
  {}
  {}
  \\end{cventries}

  \\vspace{-7mm}
  `
}

function generateProjectsSection(projects) {
  if (!projects) {
    return ''
  }

  return source`
  \\cvsection{Projects}
  \\begin{cventries}
  ${projects.map(
    project => stripIndent`
      \\cventry
        {${project.description || ''}}
        {${project.name || ''}}
        {${project.technologies || ''}}
        {${project.link || ''}}
        {}

      \\vspace{-5mm}

      `
  )}
  \\end{cventries}
  `
}

function generateAwardsSection(awards) {
  if (!awards) {
    return ''
  }

  return source`
  \\cvsection{Honors \\& Awards}
  \\begin{cvhonors}
  ${awards.map(award => {
    const { name, details, date, location } = award

    return stripIndent`
      \\cvhonor
        {${name || ''}}
        {${details || ''}}
        {${location || ''}}
        {${date || ''}}
    `
  })}
  \\end{cvhonors}
  `
}

function generateHeader() {
  return stripIndent`
    %!TEX TS-program = xelatex
    %!TEX encoding = UTF-8 Unicode
    % Awesome CV LaTeX Template
    %
    % This template has been downloaded from:
    % https://github.com/posquit0/Awesome-CV
    %
    % Author:
    % Claud D. Park <posquit0.bj@gmail.com>
    % http://www.posquit0.com
    %
    % Template license:
    % CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
    %


    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    %     Configuration
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    %%% Themes: Awesome-CV
    \\documentclass[]{awesome-cv}
    \\usepackage{textcomp}
    %%% Override a directory location for fonts(default: 'fonts/')
    \\fontdir[fonts/]

    %%% Configure a directory location for sections
    \\newcommand*{\\sectiondir}{resume/}

    %%% Override color
    % Awesome Colors: awesome-emerald, awesome-skyblue, awesome-red, awesome-pink, awesome-orange
    %                 awesome-nephritis, awesome-concrete, awesome-darknight
    %% Color for highlight
    % Define your custom color if you don't like awesome colors
    \\colorlet{awesome}{awesome-red}
    %\\definecolor{awesome}{HTML}{CA63A8}
    %% Colors for text
    %\\definecolor{darktext}{HTML}{414141}
    %\\definecolor{text}{HTML}{414141}
    %\\definecolor{graytext}{HTML}{414141}
    %\\definecolor{lighttext}{HTML}{414141}

    %%% Override a separator for social informations in header(default: ' | ')
    %\\headersocialsep[\\quad\\textbar\\quad]
  `
}

module.exports = template2
