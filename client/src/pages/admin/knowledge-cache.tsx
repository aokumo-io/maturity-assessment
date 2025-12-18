/**
 * @file knowledge-cache.tsx
 * @description 知識キャッシュ管理ページ
 * キャッシュの統計情報表示とキャッシュクリア機能を提供します。
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { logger } from '@/lib/logger';
import { RefreshCw, Trash2, Database, Clock, TrendingUp } from 'lucide-react';

/**
 * @interface CacheStats
 * @description キャッシュ統計の型定義
 */
interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  oldestEntry: string | null;
  newestEntry: string | null;
}

/**
 * @component KnowledgeCacheAdmin
 * @description 知識キャッシュ管理コンポーネント
 */
export default function KnowledgeCacheAdmin() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  /**
   * @method fetchCacheStats
   * @description キャッシュ統計を取得
   */
  const fetchCacheStats = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', '/api/knowledge/cache/stats');
      const data = await response.json();
      setStats(data);
      logger.debug('Cache stats fetched:', data);
    } catch (error: any) {
      logger.error('Failed to fetch cache stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch cache statistics',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @method clearCache
   * @description キャッシュをクリア
   */
  const clearCache = async () => {
    setIsClearing(true);
    try {
      await apiRequest('DELETE', '/api/knowledge/cache');
      toast({
        title: 'Success',
        description: 'Knowledge cache cleared successfully',
        variant: 'default'
      });
      // 統計を再取得
      await fetchCacheStats();
    } catch (error: any) {
      logger.error('Failed to clear cache:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cache',
        variant: 'destructive'
      });
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * @method formatDate
   * @description 日付をフォーマット
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  /**
   * @method getCacheUsagePercentage
   * @description キャッシュ使用率を計算
   */
  const getCacheUsagePercentage = (): number => {
    if (!stats) return 0;
    return Math.round((stats.size / stats.maxSize) * 100);
  };

  /**
   * @method getCacheUsageColor
   * @description キャッシュ使用率に基づく色を取得
   */
  const getCacheUsageColor = (): string => {
    const percentage = getCacheUsagePercentage();
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // コンポーネントマウント時に統計を取得
  useEffect(() => {
    fetchCacheStats();
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Knowledge Cache Management</h1>
        <p className="text-gray-600">
          Monitor and manage the smart knowledge cache system
        </p>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={fetchCacheStats}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </Button>
        
        <Button
          onClick={clearCache}
          disabled={isClearing || !stats || stats.size === 0}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear Cache
        </Button>
      </div>

      {/* キャッシュ統計カード */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* キャッシュサイズ */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Size</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.size}</div>
              <p className="text-xs text-muted-foreground">
                of {stats.maxSize} max entries
              </p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getCacheUsageColor()}`}
                    style={{ width: `${getCacheUsagePercentage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getCacheUsagePercentage()}% used
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ヒット率 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hitRate}%</div>
              <p className="text-xs text-muted-foreground">
                Cache effectiveness
              </p>
              <Badge variant={stats.hitRate > 70 ? 'default' : 'secondary'} className="mt-2">
                {stats.hitRate > 70 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </CardContent>
          </Card>

          {/* 最新エントリ */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Entry</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {formatDate(stats.newestEntry)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Most recent cache entry
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 詳細情報 */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Cache Details</CardTitle>
            <CardDescription>
              Detailed information about the knowledge cache system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Cache Configuration</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Maximum Entries:</span>
                    <span>{stats.maxSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Entries:</span>
                    <span>{stats.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Space:</span>
                    <span>{stats.maxSize - stats.size}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Cache Timeline</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Oldest Entry:</span>
                    <span>{formatDate(stats.oldestEntry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Newest Entry:</span>
                    <span>{formatDate(stats.newestEntry)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">How It Works</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  The smart knowledge system uses a three-tier approach:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li><strong>Static Knowledge:</strong> Pre-written content served instantly</li>
                  <li><strong>Cached AI Content:</strong> Previously generated AI responses</li>
                  <li><strong>Fresh AI Generation:</strong> New AI content when needed</li>
                </ol>
                <p>
                  This approach provides fast responses while reducing AI API costs by up to 90%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ローディング状態 */}
      {!stats && isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading cache statistics...
          </CardContent>
        </Card>
      )}

      {/* エラー状態 */}
      {!stats && !isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Failed to load cache statistics</p>
              <Button onClick={fetchCacheStats} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 