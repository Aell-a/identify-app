import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Gallery from "./Gallery";
import LabelHolder from "./Label";
import { useCallback } from "react";
import MiniUserProfile from "../Appwide/MiniUserProfile";
import VoteButtons from "../Appwide/VoteButtons";
import placeholder from "../../../../public/placeholder.png";

export default function PostDetails({ post }) {
  const timeSinceLastActivity = useCallback((dateArray) => {
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes";
    return Math.floor(seconds) + " seconds";
  }, []);

  const formatDate = useCallback((dateArray) => {
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );
    return date.toLocaleDateString();
  }, []);

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <MiniUserProfile user={post.user}>
            <div className="flex items-center mb-4">
              <Image
                src={post.user.profilePicture || placeholder}
                alt={post.user.nickname}
                width={50}
                height={50}
                className="rounded-full mr-4"
              />
              <div>
                <p className="font-semibold text-gray-100">
                  {post.user.nickname}
                </p>
              </div>
            </div>
          </MiniUserProfile>
          <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-100">
              {post.title}
            </h1>
          </div>
          <Gallery media={post.imageUrls} />
          <div className="mt-6">
            <p className="text-gray-300 mb-4">{post.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex-row items-center text-sm text-gray-400">
              <div className="mb-2">
                <p>Created: {timeSinceLastActivity(post.createdAt)} ago</p>
                {formatDate(post.updatedAt) !== formatDate(post.createdAt) && (
                  <p>Updated: {timeSinceLastActivity(post.updatedAt)} ago</p>
                )}
              </div>
              <VoteButtons
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                type="post"
                postId={post.id}
                commentId={null}
                upvotedUserIds={post.upvotedUserIds}
                downvotedUserIds={post.downvotedUserIds}
              />
            </div>
          </div>
        </div>
      </div>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-100">
            Mystery Object Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Dimensions
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-400">Length</div>
                  <div className="text-gray-200">{post.sizeX} cm</div>
                </div>
                {post.sizeY != 0 && (
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400">Width</div>
                    <div className="text-gray-200">{post.sizeY} cm</div>
                  </div>
                )}
                {post.sizeZ != 0 && (
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400">Depth</div>
                    <div className="text-gray-200">{post.sizeZ} cm</div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Weight</h3>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="text-gray-200">{post.weight}</div>
              </div>
            </div>
            <Separator className="bg-gray-700" />
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Physical Properties
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Colors</div>
                  <div className="flex flex-wrap gap-2">
                    {post.colors.map((color, index) => (
                      <Badge key={index}>{color}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Shapes</div>
                  <div className="flex flex-wrap gap-2">
                    {post.shapes.map((shape, index) => (
                      <Badge key={index}>{shape}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Materials</div>
                  <div className="flex flex-wrap gap-2">
                    {post.materials.map((material, index) => (
                      <Badge key={index}>{material}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {post.wikidataLabels && post.wikidataLabels.length > 0 && (
            <>
              <Separator className="bg-gray-700" />
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Labels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.wikidataLabels.map((label, index) => (
                    <LabelHolder
                      key={index}
                      index={index}
                      title={label.title}
                      description={label.description}
                      wikidataId={label.wikidataId}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
