import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'wouter';

// Define custom node types
const CustomNode = ({ data }: { data: { label: string; isActive?: boolean; isCompleted?: boolean } }) => {
  const getNodeStyle = () => {
    if (data.isActive) {
      return 'bg-accent-500 text-white';
    }
    if (data.isCompleted) {
      return 'bg-green-500 text-white';
    }
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <div className={`px-4 py-2 rounded-md shadow-md text-center ${getNodeStyle()}`}>
      <div className="font-medium">{data.label}</div>
    </div>
  );
};

// Define subgraph node
const SubgraphNode = ({ data }: { data: { label: string; isActive?: boolean } }) => {
  return (
    <div 
      className={`px-4 py-2 rounded-md shadow-md border-2 
        ${data.isActive ? 'border-accent-500' : 'border-gray-300'} 
        bg-white text-primary-700`}
    >
      <div className="font-medium text-center">{data.label}</div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  customNode: CustomNode,
  subgraphNode: SubgraphNode,
};

interface AssessmentFlowChartProps {
  currentStep?: string;
  completedSteps?: string[];
}

const AssessmentFlowChart: React.FC<AssessmentFlowChartProps> = ({ 
  currentStep = 'welcome',
  completedSteps = [] 
}) => {
  const [, navigate] = useLocation();
  
  // Initial nodes setup
  const initialNodes: Node[] = [
    {
      id: 'start',
      type: 'customNode',
      data: { 
        label: 'Start Assessment',
        isCompleted: completedSteps.includes('start') || completedSteps.length > 0
      },
      position: { x: 250, y: 0 },
    },
    {
      id: 'welcome',
      type: 'customNode',
      data: { 
        label: 'Welcome',
        isActive: currentStep === 'welcome',
        isCompleted: completedSteps.includes('welcome')
      },
      position: { x: 250, y: 80 },
    },
    {
      id: 'screening',
      type: 'customNode',
      data: { 
        label: 'Screening Questions',
        isActive: currentStep === 'instructions',
        isCompleted: completedSteps.includes('instructions')
      },
      position: { x: 250, y: 160 },
    },
    {
      id: 'org_profile',
      type: 'customNode',
      data: { 
        label: 'Organization Profile', 
        isActive: currentStep === 'organization-info',
        isCompleted: completedSteps.includes('organization-info')
      },
      position: { x: 250, y: 240 },
    },
    {
      id: 'assessment_group',
      type: 'subgraphNode',
      data: { 
        label: 'Assessment Areas',
        isActive: [
          'team_culture', 'containerization', 'kubernetes', 
          'cicd', 'observability', 'security', 
          'networking', 'storage'
        ].includes(currentStep || '')
      },
      position: { x: 190, y: 320 },
      style: { width: 220, height: 180 },
    },
    {
      id: 'team_culture',
      type: 'customNode',
      data: { 
        label: 'Team & Culture',
        isActive: currentStep === 'team_culture',
        isCompleted: completedSteps.includes('team_culture')
      },
      position: { x: 225, y: 360 },
      parentNode: 'assessment_group',
    },
    {
      id: 'containerization',
      type: 'customNode',
      data: { 
        label: 'Containerization',
        isActive: currentStep === 'containerization',
        isCompleted: completedSteps.includes('containerization')
      },
      position: { x: 225, y: 400 },
      parentNode: 'assessment_group',
    },
    {
      id: 'kubernetes',
      type: 'customNode',
      data: { 
        label: 'Kubernetes',
        isActive: currentStep === 'kubernetes',
        isCompleted: completedSteps.includes('kubernetes')
      },
      position: { x: 225, y: 440 },
      parentNode: 'assessment_group',
    },
    {
      id: 'processing',
      type: 'customNode',
      data: { 
        label: 'Processing Results',
        isActive: currentStep === 'processing',
        isCompleted: completedSteps.includes('processing')
      },
      position: { x: 250, y: 520 },
    },
    {
      id: 'results',
      type: 'customNode',
      data: { 
        label: 'Results Dashboard',
        isActive: currentStep === 'results',
        isCompleted: completedSteps.includes('results')
      },
      position: { x: 250, y: 600 },
    },
    {
      id: 'maturity_analysis',
      type: 'customNode',
      data: { 
        label: 'Maturity Analysis',
        isActive: currentStep === 'maturity-analysis',
        isCompleted: completedSteps.includes('maturity-analysis')
      },
      position: { x: 100, y: 680 },
    },
    {
      id: 'trail_map',
      type: 'customNode',
      data: { 
        label: 'Trail Map',
        isActive: currentStep === 'trail-map',
        isCompleted: completedSteps.includes('trail-map')
      },
      position: { x: 250, y: 680 },
    },
    {
      id: 'implementation_plan',
      type: 'customNode',
      data: { 
        label: 'Implementation Plan',
        isActive: currentStep === 'implementation-plan',
        isCompleted: completedSteps.includes('implementation-plan')
      },
      position: { x: 400, y: 680 },
    }
  ];

  // Define the initial edges
  const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'start', target: 'welcome', animated: true, style: { stroke: '#FF8015' } },
    { id: 'e2-3', source: 'welcome', target: 'screening', animated: true, style: { stroke: '#FF8015' } },
    { id: 'e3-4', source: 'screening', target: 'org_profile', animated: true, style: { stroke: '#FF8015' } },
    { id: 'e4-5', source: 'org_profile', target: 'assessment_group', animated: true, style: { stroke: '#FF8015' } },
    { id: 'e5-6', source: 'assessment_group', target: 'processing', animated: true, style: { stroke: '#FF8015' } },
    { id: 'e6-7', source: 'processing', target: 'results', animated: true, style: { stroke: '#FF8015' } },
    { id: 'e7-8', source: 'results', target: 'maturity_analysis', animated: true, style: { stroke: '#FF8015' } },
    { id: 'e7-9', source: 'results', target: 'trail_map', animated: true, style: { stroke: '#FF8015' } },
    { id: 'e7-10', source: 'results', target: 'implementation_plan', animated: true, style: { stroke: '#FF8015' } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when currentStep or completedSteps change
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === currentStep) {
          return {
            ...node,
            data: {
              ...node.data,
              isActive: true,
            },
          };
        } else if (completedSteps.includes(node.id)) {
          return {
            ...node,
            data: {
              ...node.data,
              isCompleted: true,
              isActive: false,
            },
          };
        }
        return {
          ...node,
          data: {
            ...node.data,
            isActive: false,
          },
        };
      })
    );
  }, [currentStep, completedSteps, setNodes]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Check if the node is a completed step or the current step
      if (completedSteps.includes(node.id) || node.id === currentStep) {
        // Map node IDs to routes
        const routeMap: Record<string, string> = {
          start: '/',
          welcome: '/',
          screening: '/instructions',
          org_profile: '/organization-info',
          team_culture: '/assessment/team_culture',
          containerization: '/assessment/containerization',
          kubernetes: '/assessment/kubernetes',
          cicd: '/assessment/cicd',
          observability: '/assessment/observability',
          security: '/assessment/security',
          networking: '/assessment/networking',
          storage: '/assessment/storage',
          processing: '/processing',
          results: '/results',
          maturity_analysis: '/maturity-analysis',
          trail_map: '/trail-map',
          implementation_plan: '/implementation-plan',
        };

        if (routeMap[node.id]) {
          navigate(routeMap[node.id]);
        }
      }
    },
    [navigate, completedSteps, currentStep]
  );

  return (
    <Card className="shadow-lg">
      <CardContent className="p-0 pt-6">
        <div style={{ height: '500px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentFlowChart;