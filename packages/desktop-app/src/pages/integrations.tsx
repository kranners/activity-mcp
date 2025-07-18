import React, { useState } from "react";
import { Check, ExternalLink, AlertCircle, Clock } from "lucide-react";
import {
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiOpenai, SiGooglegemini, SiSlack, SiGithub, SiClickup, SiGoogle } from '@icons-pack/react-simple-icons';

// Model providers data
const modelProviders = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4, GPT-3.5, and other OpenAI models",
    icon: SiOpenai,
    color: "bg-grey-600",
    connected: true,
    avatar: "/placeholder.svg?height=32&width=32",
    models: ["GPT-4", "GPT-3.5 Turbo", "GPT-4 Turbo"],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Gemini Pro and Ultra models for advanced AI capabilities",
    icon: SiGooglegemini,
    color: "bg-grey-600",
    connected: false,
    avatar: null,
    models: ["Gemini Pro", "Gemini Ultra", "Gemini Flash"],
  },
];

// Other integrations data
const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Connect your Slack workspace for seamless team communication",
    icon: SiSlack,
    color: "bg-grey-600",
    connected: true,
    avatar: "/placeholder.svg?height=32&width=32",
    userInfo: "Sarah Chen", // Slack display name
  },
  {
    id: "github",
    name: "GitHub",
    description: "Integrate with GitHub for code repository management",
    icon: SiGithub,
    color: "bg-grey-600",
    connected: true,
    avatar: "/placeholder.svg?height=32&width=32",
    userInfo: "@johndoe", // GitHub username
  },
  {
    id: "clickup",
    name: "ClickUp",
    description: "Sync tasks and projects with your ClickUp workspace",
    icon: SiClickup,
    color: "bg-grey-600",
    connected: false,
    avatar: null,
  },
  {
    id: "harvest",
    name: "Harvest",
    description: "Track time and manage projects with Harvest integration",
    icon: Clock,
    color: "bg-grey-600",
    connected: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "google",
    name: "Google", // Changed from "Google Workspace"
    description: "Access Google Drive, Calendar, and Gmail",
    icon: SiGoogle,
    color: "bg-grey-600",
    connected: false,
    avatar: null,
  },
];

export function IntegrationsPage() {
  const [connectingService, setConnectingService] = useState<string | null>(
    null,
  );

  const handleConnect = async (serviceId: string) => {
    setConnectingService(serviceId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setConnectingService(null);
    // In a real app, you would handle the OAuth flow here
  };

  const handleDisconnect = async (serviceId: string) => {
    // Handle disconnection logic
    console.log(`Disconnecting ${serviceId}`);
  };

  return (
    <SidebarInset>
      <main className="flex-1 overflow-auto px-6 pb-6">
        {/* Model Selection Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold">AI Models</h2>
            <Badge variant="outline" className="text-xs">
              <AlertCircle className="mr-1 h-3 w-3" />
              Required
            </Badge>
          </div>

          <div className="mb-6 rounded-lg border bg-blue-50/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                Choose your AI model
              </p>
            </div>
            <p className="mb-3 text-sm text-blue-700">
              Connect at least one model provider to start using TaskMind
              AI&apos;s intelligent features.
            </p>
            <Select defaultValue="gpt-4">
              <SelectTrigger className="w-full max-w-xs bg-white">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gemini-pro" disabled>
                  Gemini Pro (Connect first)
                </SelectItem>
                <SelectItem value="gemini-ultra" disabled>
                  Gemini Ultra (Connect first)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {modelProviders.map((provider) => (
              <Card key={provider.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${provider.color}`}
                      >
                        <provider.icon />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {provider.name}
                        </CardTitle>
                        {provider.connected && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            <Check className="mr-1 h-3 w-3" />
                            Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                    {provider.connected && provider.avatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={provider.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-xs">
                          {provider.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="mb-4 text-sm">
                    {provider.description}
                  </CardDescription>

                  <div className="flex gap-2">
                    {provider.connected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleDisconnect(provider.id)}
                        >
                          Disconnect
                        </Button>
                        <Button variant="ghost" size="sm" className="px-2">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleConnect(provider.id)}
                        disabled={connectingService === provider.id}
                      >
                        {connectingService === provider.id
                          ? "Connecting..."
                          : "Connect"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Other Integrations Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Productivity Tools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${integration.color}`}
                      >
                        <integration.icon />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {integration.name}
                        </CardTitle>
                        {integration.connected && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            <Check className="mr-1 h-3 w-3" />
                            Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                    {integration.connected && integration.avatar && (
                      <div className="flex flex-col items-end">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={integration.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {integration.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {integration.userInfo && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {integration.userInfo}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="mb-4 text-sm">
                    {integration.description}
                  </CardDescription>

                  <div className="flex gap-2">
                    {integration.connected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                        <Button variant="ghost" size="sm" className="px-2">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleConnect(integration.id)}
                        disabled={connectingService === integration.id}
                      >
                        {connectingService === integration.id
                          ? "Connecting..."
                          : "Connect"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-6">
          <h3 className="mb-2 font-medium">Need help with integrations?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Check our documentation for step-by-step guides on setting up each
            integration.
          </p>
          <Button variant="outline" size="sm">
            View Documentation
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </SidebarInset>

  );
}
