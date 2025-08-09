import { DecisionTree } from '../types';

export const decisionTrees: Record<string, DecisionTree> = {
  'hair-dryer-pro-2024': {
    deviceId: 'hair-dryer-pro-2024',
    rootNodeId: 'initial-problem',
    nodes: {
      'initial-problem': {
        id: 'initial-problem',
        question: 'What type of issue is the customer experiencing?',
        description: 'Select the primary concern to begin troubleshooting',
        options: [
          {
            id: 'power-issue',
            text: 'Device won\'t turn on / No power',
            nextNodeId: 'power-troubleshoot'
          },
          {
            id: 'heat-issue',
            text: 'Not heating properly / Temperature issues',
            nextNodeId: 'heat-troubleshoot'
          },
          {
            id: 'airflow-issue',
            text: 'Weak airflow / Fan problems',
            nextNodeId: 'airflow-troubleshoot'
          },
          {
            id: 'noise-issue',
            text: 'Unusual noise / Vibration',
            nextNodeId: 'noise-troubleshoot'
          },
          {
            id: 'physical-damage',
            text: 'Physical damage / Cord issues',
            nextNodeId: 'damage-assessment'
          }
        ]
      },
      'power-troubleshoot': {
        id: 'power-troubleshoot',
        question: 'Is the device plugged into a working outlet?',
        description: 'First, let\'s verify the power source',
        options: [
          {
            id: 'outlet-working',
            text: 'Yes, outlet is working (tested with another device)',
            nextNodeId: 'check-power-button'
          },
          {
            id: 'outlet-not-working',
            text: 'No, or outlet hasn\'t been tested',
            nextNodeId: 'test-outlet'
          }
        ]
      },
      'test-outlet': {
        id: 'test-outlet',
        question: 'After testing the outlet with another device, does it work?',
        description: 'Have the customer test the outlet with a lamp or other device',
        options: [
          {
            id: 'outlet-confirmed-working',
            text: 'Yes, outlet works with other devices',
            nextNodeId: 'check-power-button'
          },
          {
            id: 'outlet-not-working-confirmed',
            text: 'No, outlet is not working',
            solution: 'The issue is with the electrical outlet, not the device. Advise customer to contact an electrician or try a different outlet.'
          }
        ]
      },
      'check-power-button': {
        id: 'check-power-button',
        question: 'Does the power button click properly when pressed?',
        description: 'Check if the power button feels normal and responsive',
        options: [
          {
            id: 'button-clicks-normally',
            text: 'Yes, button clicks normally',
            nextNodeId: 'check-cord-damage'
          },
          {
            id: 'button-stuck-loose',
            text: 'No, button is stuck, loose, or unresponsive',
            solution: 'Power button mechanism is faulty. Device requires repair or replacement. Check warranty status and process RMA if applicable.',
            isTerminal: true
          }
        ]
      },
      'check-cord-damage': {
        id: 'check-cord-damage',
        question: 'Is there any visible damage to the power cord?',
        description: 'Look for cuts, kinks, exposed wires, or bent plugs',
        options: [
          {
            id: 'cord-undamaged',
            text: 'No visible damage to cord',
            solution: 'Internal electrical fault suspected. Device requires professional repair. Check warranty status and initiate RMA process.',
            isTerminal: true,
            additionalInfo: 'Log this as an internal electrical failure. Estimated repair time: 5-7 business days.'
          },
          {
            id: 'cord-damaged',
            text: 'Yes, visible damage to power cord',
            solution: 'Power cord is damaged and unsafe to use. Device requires repair or replacement. Do not advise customer to continue using. Process immediate RMA.',
            isTerminal: true,
            additionalInfo: 'Safety concern - prioritize this case. Replacement cord may be available depending on warranty terms.'
          }
        ]
      },
      'heat-troubleshoot': {
        id: 'heat-troubleshoot',
        question: 'Does the device turn on but produce no heat, or does it produce some heat but not enough?',
        options: [
          {
            id: 'no-heat-at-all',
            text: 'Device turns on but produces no heat at all',
            nextNodeId: 'heat-setting-check'
          },
          {
            id: 'insufficient-heat',
            text: 'Device produces some heat but not as hot as expected',
            nextNodeId: 'heat-setting-max'
          }
        ]
      },
      'heat-setting-check': {
        id: 'heat-setting-check',
        question: 'Is the heat setting turned to maximum?',
        description: 'Verify the temperature control is set to highest setting',
        options: [
          {
            id: 'heat-on-max',
            text: 'Yes, heat setting is on maximum',
            solution: 'Heating element failure. Device requires repair. The heating coil likely needs replacement. Check warranty and process RMA.',
            isTerminal: true,
            additionalInfo: 'Common issue after 12+ months of use. Replacement heating element available for in-warranty devices.'
          },
          {
            id: 'heat-not-max',
            text: 'No, heat was not on maximum setting',
            solution: 'Advise customer to set heat to maximum and test again. If still no heat after setting to max, heating element has failed and device needs repair.',
            isTerminal: true
          }
        ]
      },
      'heat-setting-max': {
        id: 'heat-setting-max',
        question: 'How long has the customer owned this device?',
        description: 'Check purchase date or warranty information',
        options: [
          {
            id: 'recent-purchase',
            text: 'Less than 6 months',
            solution: 'Defective heating element from manufacturing. Full replacement warranted. Process immediate RMA for new device.',
            isTerminal: true,
            additionalInfo: 'Manufacturing defect - expedite replacement process.'
          },
          {
            id: 'older-device',
            text: '6 months or more',
            solution: 'Normal wear on heating element. Performance degradation expected over time. Check warranty status - may qualify for discounted replacement.',
            isTerminal: true,
            additionalInfo: 'Normal wear pattern. Offer maintenance tips to extend device life.'
          }
        ]
      },
      'airflow-troubleshoot': {
        id: 'airflow-troubleshoot',
        question: 'When did the customer last clean the air intake filter?',
        description: 'Check maintenance history',
        options: [
          {
            id: 'recently-cleaned',
            text: 'Within the last month',
            nextNodeId: 'check-obstruction'
          },
          {
            id: 'not-recently-cleaned',
            text: 'More than a month ago or never',
            solution: 'Clogged air filter is likely cause. Guide customer through cleaning process: Remove back filter, rinse with warm water, let dry completely, reinstall. Test device after cleaning.',
            isTerminal: true,
            additionalInfo: 'Recommend monthly filter cleaning for optimal performance.'
          }
        ]
      },
      'check-obstruction': {
        id: 'check-obstruction',
        question: 'Is there any visible hair or debris in the air intake or outlet?',
        options: [
          {
            id: 'no-obstruction',
            text: 'No visible obstruction',
            solution: 'Internal fan motor issue suspected. Device requires professional service. Fan motor may need replacement or repair.',
            isTerminal: true,
            additionalInfo: 'Motor replacement typically covered under warranty for first 24 months.'
          },
          {
            id: 'obstruction-found',
            text: 'Yes, hair or debris visible',
            solution: 'Remove visible debris carefully with tweezers (device unplugged). Clean thoroughly and test. If airflow still weak after cleaning, internal motor service needed.',
            isTerminal: true
          }
        ]
      },
      'noise-troubleshoot': {
        id: 'noise-troubleshoot',
        question: 'What type of noise is the device making?',
        options: [
          {
            id: 'grinding-noise',
            text: 'Grinding or scraping sound',
            solution: 'Foreign object in fan mechanism or worn bearings. Stop using immediately - potential safety hazard. Device requires immediate professional service.',
            isTerminal: true,
            additionalInfo: 'Safety priority - advise immediate discontinuation of use.'
          },
          {
            id: 'rattling-noise',
            text: 'Rattling or vibrating sound',
            solution: 'Loose internal component or unbalanced fan. Device should be serviced to prevent further damage. Safe to use temporarily at lower speeds.',
            isTerminal: true
          },
          {
            id: 'high-pitched-whine',
            text: 'High-pitched whining sound',
            solution: 'Motor bearing wear or overheating. Reduce usage frequency and schedule service. Motor may need lubrication or replacement.',
            isTerminal: true,
            additionalInfo: 'Early intervention can prevent complete motor failure.'
          }
        ]
      },
      'damage-assessment': {
        id: 'damage-assessment',
        question: 'What type of physical damage is present?',
        options: [
          {
            id: 'cord-damage-visible',
            text: 'Power cord has cuts, kinks, or exposed wires',
            solution: 'Cord damage creates serious safety hazard. Device must not be used. Immediate replacement or repair required. Check if cord damage is covered under warranty terms.',
            isTerminal: true,
            additionalInfo: 'SAFETY CRITICAL - emphasize danger of electrical shock or fire.'
          },
          {
            id: 'housing-cracks',
            text: 'Cracks in plastic housing',
            solution: 'Structural damage may affect safety and performance. Assess if cracks expose internal components. Minor cosmetic cracks may not require immediate service.',
            isTerminal: true,
            additionalInfo: 'Photo documentation recommended for warranty claims.'
          },
          {
            id: 'buttons-damaged',
            text: 'Control buttons are broken or missing',
            solution: 'Control panel replacement needed. Device may be unsafe to operate without proper controls. Check availability of replacement control assembly.',
            isTerminal: true
          }
        ]
      }
    }
  },
  'straightener-elite-x1': {
    deviceId: 'straightener-elite-x1',
    rootNodeId: 'straightener-initial',
    nodes: {
      'straightener-initial': {
        id: 'straightener-initial',
        question: 'What issue is the customer experiencing with their straightener?',
        options: [
          {
            id: 'not-heating',
            text: 'Device not heating up',
            nextNodeId: 'straightener-power-check'
          },
          {
            id: 'uneven-heating',
            text: 'Plates heating unevenly',
            solution: 'Uneven plate heating indicates internal sensor or heating element issues. Device requires professional calibration or repair.',
            isTerminal: true
          },
          {
            id: 'plates-sticking',
            text: 'Plates are sticky or pulling hair',
            solution: 'Clean plates with appropriate cleaning solution. If problem persists after cleaning, plate coating may be damaged and require replacement.',
            isTerminal: true,
            additionalInfo: 'Recommend ceramic plate cleaner for maintenance.'
          }
        ]
      },
      'straightener-power-check': {
        id: 'straightener-power-check',
        question: 'Does the power indicator light turn on?',
        options: [
          {
            id: 'light-on',
            text: 'Yes, power light is on',
            solution: 'Power is reaching device but heating elements have failed. Internal repair required for heating element replacement.',
            isTerminal: true
          },
          {
            id: 'light-off',
            text: 'No, no power light',
            solution: 'Check power connection and outlet. If outlet works with other devices, the straightener has an internal electrical fault and needs repair.',
            isTerminal: true
          }
        ]
      }
    }
  }
};