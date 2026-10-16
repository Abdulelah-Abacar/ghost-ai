"use client";

import {
  Component,
  type DragEvent,
  type ErrorInfo,
  type ReactNode,
  useRef,
} from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  RectangleHorizontal,
} from "lucide-react";

import {
  NODE_COLORS,
  NODE_SHAPES,
  type CanvasEdge,
  type CanvasNode,
  type NodeShape,
} from "@/types/canvas";
import "@xyflow/react/dist/style.css";

interface CanvasRoomProps {
  roomId: string;
}

interface CanvasErrorBoundaryProps {
  children: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    console.error("Liveblocks canvas connection failed", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center bg-base px-6 text-center">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold text-copy-primary">
              Canvas unavailable
            </h1>
            <p className="text-sm text-copy-muted">
              The collaborative canvas could not connect. Refresh the page to
              try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoadingCanvas() {
  return (
    <div
      className="flex h-full items-center justify-center bg-base text-sm text-copy-muted"
      role="status"
    >
      Connecting to canvas…
    </div>
  );
}

const SHAPE_SIZES: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 180, height: 100 },
  diamond: { width: 180, height: 150 },
  circle: { width: 120, height: 120 },
  pill: { width: 180, height: 80 },
  cylinder: { width: 160, height: 120 },
  hexagon: { width: 180, height: 110 },
};

const SHAPE_ICONS = {
  rectangle: RectangleHorizontal,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
} satisfies Record<NodeShape, typeof RectangleHorizontal>;

interface ShapeDragPayload {
  shape: NodeShape;
  width: number;
  height: number;
}

const SHAPE_DRAG_TYPE = "application/ghost-ai-shape";

function CanvasNodeView({ data }: NodeProps<CanvasNode>) {
  const shapePaths: Record<NodeShape, ReactNode> = {
    rectangle: <rect x="3" y="3" width="94" height="94" rx="10" />,
    diamond: <polygon points="50,3 97,50 50,97 3,50" />,
    circle: <ellipse cx="50" cy="50" rx="47" ry="47" />,
    pill: <rect x="3" y="14" width="94" height="72" rx="36" />,
    cylinder: (
      <path d="M3 18 C3 4 97 4 97 18 V82 C97 96 3 96 3 82 Z M3 18 C3 32 97 32 97 18 M3 82 C3 68 97 68 97 82" />
    ),
    hexagon: <polygon points="25,3 75,3 97,50 75,97 25,97 3,50" />,
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center text-center"
      style={{
        color: data.color.text,
      }}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g
          fill={data.color.fill}
          stroke={data.color.text}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        >
          {shapePaths[data.shape]}
        </g>
      </svg>
      <span className="relative z-10 max-w-[72%] break-words px-2">{data.label}</span>
    </div>
  );
}

const NODE_TYPES = { canvasNode: CanvasNodeView };

function LiveCanvasContent() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });
  const flow = useReactFlow<CanvasNode, CanvasEdge>();
  const nodeCounter = useRef(0);

  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
    shape: NodeShape,
  ) {
    const size = SHAPE_SIZES[shape];
    const payload: ShapeDragPayload = { shape, ...size };
    event.dataTransfer.setData(SHAPE_DRAG_TYPE, JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "copy";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const rawPayload = event.dataTransfer.getData(SHAPE_DRAG_TYPE);
    if (!rawPayload) return;

    let payload: ShapeDragPayload;
    try {
      payload = JSON.parse(rawPayload) as ShapeDragPayload;
    } catch {
      return;
    }
    if (
      !NODE_SHAPES.includes(payload.shape) ||
      !Number.isFinite(payload.width) ||
      !Number.isFinite(payload.height)
    )
      return;

    nodeCounter.current += 1;
    const position = flow.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const node: CanvasNode = {
      id: `${payload.shape}-${Date.now()}-${nodeCounter.current}`,
      type: "canvasNode",
      position,
      data: { label: "", color: NODE_COLORS[0], shape: payload.shape },
      style: { width: payload.width, height: payload.height },
    };
    onNodesChange([{ type: "add", item: node }]);
  }

  return (
    <div
      className="relative h-full w-full bg-base"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={NODE_TYPES}
        fitView
        colorMode="dark"
      >
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
      <div
        style={{ bottom: 20 }}
        className="test absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-surface-border bg-surface/95 p-2 shadow-xl backdrop-blur"
      >
        {NODE_SHAPES.map((shape) => {
          const Icon = SHAPE_ICONS[shape];
          return (
            <button
              key={shape}
              type="button"
              draggable
              onDragStart={(event) => handleDragStart(event, shape)}
              aria-label={`Drag ${shape} node onto canvas`}
              title={shape}
              className="flex h-10 w-10 cursor-grab items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-subtle hover:text-brand active:cursor-grabbing"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LiveCanvas() {
  return (
    <ReactFlowProvider>
      <LiveCanvasContent />
    </ReactFlowProvider>
  );
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <CanvasErrorBoundary>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{ cursor: null, isThinking: false }}
        >
          <ClientSideSuspense fallback={<LoadingCanvas />}>
            {() => <LiveCanvas />}
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </CanvasErrorBoundary>
  );
}
