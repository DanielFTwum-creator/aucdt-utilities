import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TrendlineOptions } from '@/utils/trendlines';

interface TrendlineControlsProps {
  showTrendlines: boolean;
  onToggleTrendlines: (show: boolean) => void;
  trendlineOptions: TrendlineOptions;
  onOptionsChange: (options: TrendlineOptions) => void;
  activeTrendlines: {
    signups: boolean;
    applicants: boolean;
    accepted: boolean;
    registered: boolean;
  };
  onActiveTrendlinesChange: (trendlines: {
    signups: boolean;
    applicants: boolean;
    accepted: boolean;
    registered: boolean;
  }) => void;
}

export function TrendlineControls({
  showTrendlines,
  onToggleTrendlines,
  trendlineOptions,
  onOptionsChange,
  activeTrendlines,
  onActiveTrendlinesChange
}: TrendlineControlsProps) {
  const handleTrendlineToggle = (series: keyof typeof activeTrendlines) => {
    onActiveTrendlinesChange({
      ...activeTrendlines,
      [series]: !activeTrendlines[series]
    });
  };

  const handleTypeChange = (type: 'linear' | 'polynomial' | 'movingAverage') => {
    onOptionsChange({
      ...trendlineOptions,
      type
    });
  };

  const handleDegreeChange = (degree: string) => {
    onOptionsChange({
      ...trendlineOptions,
      degree: parseInt(degree)
    });
  };

  const handlePeriodChange = (period: string) => {
    onOptionsChange({
      ...trendlineOptions,
      period: parseInt(period)
    });
  };

  const toggleAllTrendlines = (enabled: boolean) => {
    onActiveTrendlinesChange({
      signups: enabled,
      applicants: enabled,
      accepted: enabled,
      registered: enabled
    });
  };

  return (
    <Card className="border-l-4 border-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            📈 Trendline Controls
            <Badge variant={showTrendlines ? "default" : "secondary"}>
              {showTrendlines ? "Active" : "Inactive"}
            </Badge>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-gray-600">Enable Trendlines</span>
            <Switch
              checked={showTrendlines}
              onCheckedChange={onToggleTrendlines}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showTrendlines && (
          <div className="space-y-6">
            {/* Trendline Type Selection */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Trendline Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant={trendlineOptions.type === 'linear' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('linear')}
                  className="justify-start"
                >
                  📊 Linear Regression
                </Button>
                <Button
                  variant={trendlineOptions.type === 'polynomial' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('polynomial')}
                  className="justify-start"
                >
                  📈 Polynomial Curve
                </Button>
                <Button
                  variant={trendlineOptions.type === 'movingAverage' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('movingAverage')}
                  className="justify-start"
                >
                  📉 Moving Average
                </Button>
              </div>
            </div>

            <Separator />

            {/* Type-specific Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendlineOptions.type === 'polynomial' && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Polynomial Degree
                    </label>
                    <Select
                      value={trendlineOptions.degree?.toString() || '2'}
                      onValueChange={handleDegreeChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Quadratic (2nd degree)</SelectItem>
                        <SelectItem value="3">Cubic (3rd degree)</SelectItem>
                        <SelectItem value="4">Quartic (4th degree)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {trendlineOptions.type === 'movingAverage' && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Moving Average Period
                    </label>
                    <Select
                      value={trendlineOptions.period?.toString() || '3'}
                      onValueChange={handlePeriodChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3-Month Average</SelectItem>
                        <SelectItem value="6">6-Month Average</SelectItem>
                        <SelectItem value="12">12-Month Average</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Individual Series Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Data Series</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllTrendlines(true)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllTrendlines(false)}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-700">Signups</span>
                  </div>
                  <Switch
                    checked={activeTrendlines.signups}
                    onCheckedChange={() => handleTrendlineToggle('signups')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Applicants</span>
                  </div>
                  <Switch
                    checked={activeTrendlines.applicants}
                    onCheckedChange={() => handleTrendlineToggle('applicants')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span className="text-sm font-medium text-teal-700">Accepted</span>
                  </div>
                  <Switch
                    checked={activeTrendlines.accepted}
                    onCheckedChange={() => handleTrendlineToggle('accepted')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm font-medium text-emerald-700">Registered</span>
                  </div>
                  <Switch
                    checked={activeTrendlines.registered}
                    onCheckedChange={() => handleTrendlineToggle('registered')}
                  />
                </div>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">💡 Trendline Tips</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Linear:</strong> Shows general direction and steady trends</li>
                <li>• <strong>Polynomial:</strong> Captures curved patterns and seasonal effects</li>
                <li>• <strong>Moving Average:</strong> Smooths out noise and shows underlying trends</li>
                <li>• Check R² values in tooltips to assess trend strength</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
